CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT,
  phone TEXT,
  governorate TEXT,
  customer_type TEXT,
  category TEXT,
  message TEXT,
  source_page TEXT,
  source_type TEXT,
  product_name TEXT,
  locale TEXT,
  contacted INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_contacted ON leads(contacted);
