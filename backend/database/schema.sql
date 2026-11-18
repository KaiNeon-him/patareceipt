-- PataReceipt Database Schema (MVP)
-- Run: psql -U postgres -d patareceipt -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  business_name VARCHAR(100) NOT NULL,
  default_currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receipts (
  receipt_id VARCHAR(20) PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  client_name VARCHAR(100) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  terms_and_notes TEXT DEFAULT '',
  status VARCHAR(20) DEFAULT 'SENT' CHECK (status IN ('SENT', 'VIEWED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS line_items (
  item_id SERIAL PRIMARY KEY,
  receipt_id VARCHAR(20) REFERENCES receipts(receipt_id) ON DELETE CASCADE,
  description VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0)
);

CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON receipts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_line_items_receipt_id ON line_items(receipt_id);

CREATE TABLE IF NOT EXISTS receipt_templates (
  template_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  primary_color VARCHAR(7) DEFAULT '#1a1a2e',
  font_family VARCHAR(50) DEFAULT 'Helvetica',
  show_logo BOOLEAN DEFAULT TRUE,
  show_watermark BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  receipt_id VARCHAR(20) REFERENCES receipts(receipt_id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  provider VARCHAR(50) NOT NULL,
  provider_reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_user_id ON receipt_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payment_transactions(user_id);