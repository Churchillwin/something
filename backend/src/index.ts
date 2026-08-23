import { answerPreCheckoutQuery, createStarsInvoiceLink, verifyInitData } from "./telegram";

export interface Env {
  DB: D1Database;
  BOT_TOKEN: string;
  // Telegram's `secret_token` for setWebhook — lets the webhook route reject
  // anything that isn't actually from Telegram. Generate any random string.
  WEBHOOK_SECRET: string;
  // Origin the Mini App is served from (GitHub Pages), for CORS. "*" works
  // too since there's no cookie/credential auth here, only initData.
  ALLOWED_ORIGIN: string;
}

// Server-side mirror of app.js's `interfaceSkinProducts`. This is the one
// that actually matters for money — the client's copy is UI only. Keep the
// two in sync by hand; there's intentionally no shared build step here.
const PRODUCTS: Record<string, { themeId: string; title: string; description: string; amountStars: number }> = {
  interface_skin_liquid_v1: {
    themeId: "liquid",
    title: "Живое ядро",
    description: "Косметическая тема интерфейса Liquid Core. Не влияет на силу тапа, награды или прогресс.",
    amountStars: 199,
  },
};

function corsHeaders(env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

// Best-effort, per-isolate rate limit. Workers isolates are ephemeral and
// this resets on cold start, so it is a courtesy backstop against a single
// runaway client, not a real defense — put actual limits on the Cloudflare
// dashboard (Rate Limiting Rules) in front of this Worker for that.
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}

async function ensureUser(db: D1Database, telegramUserId: number): Promise<void> {
  await db
    .prepare(
      `INSERT INTO users (telegram_user_id) VALUES (?1)
       ON CONFLICT(telegram_user_id) DO UPDATE SET last_seen_at = datetime('now')`,
    )
    .bind(telegramUserId)
    .run();
}

async function handleInvoice(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(`invoice:${ip}`, 10, 60_000)) {
    return json({ error: "rate_limited" }, env, 429);
  }

  let body: { productId?: unknown; initData?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, env, 400);
  }

  const productId = typeof body.productId === "string" ? body.productId : "";
  const initData = typeof body.initData === "string" ? body.initData : "";
  const product = PRODUCTS[productId];
  if (!product) return json({ error: "unknown_product" }, env, 400);

  const verified = await verifyInitData(initData, env.BOT_TOKEN);
  if (!verified) return json({ error: "invalid_init_data" }, env, 401);

  await ensureUser(env.DB, verified.userId);

  const alreadyOwned = await env.DB.prepare(
    `SELECT 1 FROM entitlements WHERE telegram_user_id = ?1 AND product_id = ?2 AND status = 'owned'`,
  )
    .bind(verified.userId, productId)
    .first();
  if (alreadyOwned) return json({ error: "already_owned" }, env, 409);

  // Payload round-trips through Telegram unmodified and is re-validated in
  // the webhook (product id + user id must match) before anything is
  // granted — the invoice link alone grants nothing.
  const payload = JSON.stringify({ productId, userId: verified.userId, nonce: crypto.randomUUID() });

  try {
    const invoiceUrl = await createStarsInvoiceLink(env.BOT_TOKEN, {
      title: product.title,
      description: product.description,
      payload,
      amountStars: product.amountStars,
    });
    return json({ invoiceUrl }, env);
  } catch (error) {
    return json({ error: "invoice_creation_failed", detail: String(error) }, env, 502);
  }
}

interface TelegramUpdate {
  pre_checkout_query?: {
    id: string;
    from: { id: number };
    currency: string;
    total_amount: number;
    invoice_payload: string;
  };
  message?: {
    successful_payment?: {
      currency: string;
      total_amount: number;
      invoice_payload: string;
      telegram_payment_charge_id: string;
    };
    from?: { id: number };
  };
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
  if (secretHeader !== env.WEBHOOK_SECRET) return new Response("forbidden", { status: 403 });

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  // pre_checkout_query must be answered within Telegram's ~10s window;
  // this is the last point where a bad amount/currency/payload can still
  // stop the charge before it happens.
  if (update.pre_checkout_query) {
    const query = update.pre_checkout_query;
    let payload: { productId?: string; userId?: number };
    try {
      payload = JSON.parse(query.invoice_payload);
    } catch {
      payload = {};
    }
    const product = payload.productId ? PRODUCTS[payload.productId] : undefined;
    const valid =
      Boolean(product) &&
      query.currency === "XTR" &&
      product!.amountStars === query.total_amount &&
      payload.userId === query.from.id;

    await answerPreCheckoutQuery(
      env.BOT_TOKEN,
      query.id,
      valid,
      valid ? undefined : "Не удалось подтвердить покупку, попробуйте ещё раз",
    );
    return new Response("ok");
  }

  // successful_payment is the ONLY event that grants an entitlement. The
  // client's openInvoice("paid") callback is never trusted for this — it
  // only tells the client to go ask this server (via /me/skins) what it
  // actually owns.
  const payment = update.message?.successful_payment;
  const fromId = update.message?.from?.id;
  if (payment && fromId) {
    let payload: { productId?: string; userId?: number };
    try {
      payload = JSON.parse(payment.invoice_payload);
    } catch {
      payload = {};
    }
    const product = payload.productId ? PRODUCTS[payload.productId] : undefined;
    const valid =
      Boolean(product) &&
      payment.currency === "XTR" &&
      product!.amountStars === payment.total_amount &&
      payload.userId === fromId;

    if (valid) {
      await ensureUser(env.DB, fromId);
      // UNIQUE(telegram_payment_charge_id) makes a resent update a no-op.
      const insert = await env.DB.prepare(
        `INSERT OR IGNORE INTO payments
           (telegram_payment_charge_id, telegram_user_id, product_id, amount, currency, invoice_payload)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
      )
        .bind(payment.telegram_payment_charge_id, fromId, payload.productId, payment.total_amount, payment.currency, payment.invoice_payload)
        .run();

      if (insert.meta.changes > 0) {
        const paymentRow = await env.DB.prepare(`SELECT id FROM payments WHERE telegram_payment_charge_id = ?1`)
          .bind(payment.telegram_payment_charge_id)
          .first<{ id: number }>();
        await env.DB.prepare(
          `INSERT INTO entitlements (telegram_user_id, product_id, theme_id, status, purchase_id)
           VALUES (?1, ?2, ?3, 'owned', ?4)
           ON CONFLICT(telegram_user_id, product_id) DO UPDATE SET status = 'owned', purchase_id = excluded.purchase_id`,
        )
          .bind(fromId, payload.productId, product!.themeId, paymentRow?.id ?? null)
          .run();
      }
    }
  }

  // Always 200 — Telegram retries on non-2xx, and an invalid/unmatched
  // payload above is already a terminal no-op, not something to retry.
  return new Response("ok");
}

async function handleMeSkins(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(`me-skins:${ip}`, 30, 60_000)) return json({ error: "rate_limited" }, env, 429);

  let body: { initData?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, env, 400);
  }
  const verified = await verifyInitData(typeof body.initData === "string" ? body.initData : "", env.BOT_TOKEN);
  if (!verified) return json({ error: "invalid_init_data" }, env, 401);

  const rows = await env.DB.prepare(`SELECT theme_id FROM entitlements WHERE telegram_user_id = ?1 AND status = 'owned'`)
    .bind(verified.userId)
    .all<{ theme_id: string }>();

  return json({ ownedThemeIds: (rows.results ?? []).map((row) => row.theme_id) }, env);
}

async function handleSelectSkin(request: Request, env: Env): Promise<Response> {
  let body: { initData?: unknown; themeId?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, env, 400);
  }
  const verified = await verifyInitData(typeof body.initData === "string" ? body.initData : "", env.BOT_TOKEN);
  if (!verified) return json({ error: "invalid_init_data" }, env, 401);

  const themeId = typeof body.themeId === "string" ? body.themeId : "";
  if (themeId !== "default") {
    const owned = await env.DB.prepare(
      `SELECT 1 FROM entitlements WHERE telegram_user_id = ?1 AND theme_id = ?2 AND status = 'owned'`,
    )
      .bind(verified.userId, themeId)
      .first();
    if (!owned) return json({ error: "not_owned" }, env, 403);
  }

  await ensureUser(env.DB, verified.userId);
  await env.DB.prepare(
    `INSERT INTO user_preferences (telegram_user_id, selected_theme_id) VALUES (?1, ?2)
     ON CONFLICT(telegram_user_id) DO UPDATE SET selected_theme_id = excluded.selected_theme_id, updated_at = datetime('now')`,
  )
    .bind(verified.userId, themeId)
    .run();

  return json({ ok: true }, env);
}

// Confirms BOT_TOKEN is a real, working token without ever exposing it —
// getMe returns only public bot info (id/username), never the token.
async function handleHealth(env: Env): Promise<Response> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/getMe`);
    const data = (await response.json()) as { ok: boolean; result?: { username?: string } };
    return json({ botTokenValid: data.ok, botUsername: data.ok ? data.result?.username : undefined }, env);
  } catch (error) {
    return json({ botTokenValid: false, error: String(error) }, env, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") return handleHealth(env);
    if (request.method === "POST" && url.pathname === "/invoice") return handleInvoice(request, env);
    if (request.method === "POST" && url.pathname === "/telegram/webhook") return handleWebhook(request, env);
    if (request.method === "POST" && url.pathname === "/me/skins") return handleMeSkins(request, env);
    if (request.method === "POST" && url.pathname === "/me/select-skin") return handleSelectSkin(request, env);

    return json({ error: "not_found" }, env, 404);
  },
};
