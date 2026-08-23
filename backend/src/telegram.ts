// Telegram-specific crypto and Bot API calls. Nothing here trusts anything
// the client sends without checking it against this server's own BOT_TOKEN
// secret, which never leaves this Worker's environment.

const encoder = new TextEncoder();

async function hmacSha256(key: ArrayBuffer | Uint8Array, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface VerifiedInitData {
  userId: number;
  raw: Record<string, string>;
}

// Implements Telegram's documented Mini App initData check:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
// secret_key = HMAC_SHA256("WebAppData", bot_token)
// data_check_string = every field except `hash`, "key=value" sorted by key, joined with "\n"
// valid iff HMAC_SHA256(secret_key, data_check_string) === hash
export async function verifyInitData(
  initData: string,
  botToken: string,
  { maxAgeSeconds = 86_400 }: { maxAgeSeconds?: number } = {},
): Promise<VerifiedInitData | null> {
  if (!initData || !botToken) return null;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    return null;
  }

  const hash = params.get("hash");
  if (!hash) return null;

  const raw: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key !== "hash") raw[key] = value;
  }

  const dataCheckString = Object.keys(raw)
    .sort()
    .map((key) => `${key}=${raw[key]}`)
    .join("\n");

  const secretKey = await hmacSha256(encoder.encode("WebAppData"), botToken);
  const computedHash = toHex(await hmacSha256(secretKey, dataCheckString));

  if (computedHash !== hash) return null;

  const authDate = Number(raw.auth_date);
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) return null;

  let userId: number | null = null;
  try {
    const user = JSON.parse(raw.user ?? "{}");
    userId = typeof user.id === "number" ? user.id : null;
  } catch {
    userId = null;
  }
  if (!userId) return null;

  return { userId, raw };
}

const TELEGRAM_API_ROOT = "https://api.telegram.org";

async function callBotApi<T>(botToken: string, method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${TELEGRAM_API_ROOT}/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as { ok: boolean; result?: T; description?: string };
  if (!data.ok) throw new Error(data.description ?? `Telegram API ${method} failed`);
  return data.result as T;
}

// currency must be "XTR" (Telegram Stars) — prices array is a single amount
// in Stars for a one-time digital good, no provider_token needed for XTR.
export async function createStarsInvoiceLink(
  botToken: string,
  { title, description, payload, amountStars }: { title: string; description: string; payload: string; amountStars: number },
): Promise<string> {
  return callBotApi<string>(botToken, "createInvoiceLink", {
    title,
    description,
    payload,
    currency: "XTR",
    prices: [{ label: title, amount: amountStars }],
  });
}

export async function answerPreCheckoutQuery(
  botToken: string,
  preCheckoutQueryId: string,
  ok: boolean,
  errorMessage?: string,
): Promise<void> {
  await callBotApi(botToken, "answerPreCheckoutQuery", {
    pre_checkout_query_id: preCheckoutQueryId,
    ok,
    ...(errorMessage ? { error_message: errorMessage } : {}),
  });
}

export async function refundStarPayment(botToken: string, telegramUserId: number, chargeId: string): Promise<void> {
  await callBotApi(botToken, "refundStarPayment", {
    user_id: telegramUserId,
    telegram_payment_charge_id: chargeId,
  });
}
