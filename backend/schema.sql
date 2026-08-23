-- Anime Tap Clicker — Stars purchase backend schema (Cloudflare D1 / SQLite)
--
-- Everything here exists to answer one question honestly: "does this
-- Telegram user actually own this product?" — payments and entitlements are
-- only ever written by the webhook handler after Telegram confirms a real
-- successful_payment, never by any client-facing endpoint.

CREATE TABLE IF NOT EXISTS users (
  telegram_user_id INTEGER PRIMARY KEY,
  first_seen_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One row per Telegram Stars payment. `telegram_payment_charge_id` is the
-- idempotency key: Telegram may resend the same successful_payment update,
-- and this UNIQUE constraint is what makes a re-send a no-op instead of a
-- double grant (INSERT OR IGNORE in the webhook handler relies on it).
CREATE TABLE IF NOT EXISTS payments (
  id                          INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_payment_charge_id  TEXT NOT NULL UNIQUE,
  telegram_user_id            INTEGER NOT NULL REFERENCES users(telegram_user_id),
  product_id                  TEXT NOT NULL,
  amount                      INTEGER NOT NULL,
  currency                    TEXT NOT NULL,
  invoice_payload             TEXT NOT NULL,
  status                      TEXT NOT NULL DEFAULT 'confirmed', -- confirmed | refunded
  created_at                  TEXT NOT NULL DEFAULT (datetime('now')),
  refunded_at                 TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(telegram_user_id);

-- One row per (user, product) they own. Derived from `payments`, but kept
-- as its own table so /me/skins is a single indexed lookup, and so a refund
-- can flip `status` without deleting the payment history above.
CREATE TABLE IF NOT EXISTS entitlements (
  telegram_user_id INTEGER NOT NULL REFERENCES users(telegram_user_id),
  product_id       TEXT NOT NULL,
  theme_id         TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'owned', -- owned | revoked
  purchase_id      INTEGER NOT NULL REFERENCES payments(id),
  purchased_at     TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (telegram_user_id, product_id)
);

-- Cross-device "which theme is currently selected" — cosmetic preference
-- only, never consulted for ownership checks.
CREATE TABLE IF NOT EXISTS user_preferences (
  telegram_user_id INTEGER PRIMARY KEY REFERENCES users(telegram_user_id),
  selected_theme_id TEXT NOT NULL DEFAULT 'default',
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
