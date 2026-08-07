import { db } from './database';

const CURRENT_VERSION = 2;

export function initSchema() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      version INTEGER
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      shop_name TEXT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      car_make_model TEXT,
      photo_uri TEXT,
      quantity INTEGER DEFAULT 0,
      price REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      part_id TEXT NOT NULL,
      quantity_sold INTEGER NOT NULL,
      sale_price REAL,
      sold_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (part_id) REFERENCES parts (id)
    );
  `);

  const row = db.getFirstSync('SELECT version FROM schema_meta LIMIT 1');

  if (!row) {
    db.runSync('INSERT INTO schema_meta (version) VALUES (?)', [CURRENT_VERSION]);
  }
  else if (row.version < CURRENT_VERSION) {
    // migrations for newer schema versions
    if (row.version < 2) {
      // add sale_note column to sales table
      try {
        db.execSync(`ALTER TABLE sales ADD COLUMN sale_note TEXT DEFAULT ''`);
      } catch (err) {
        // ignore if column already exists or sqlite limitation
      }
      db.runSync('UPDATE schema_meta SET version = ?', [2]);
    }
  }
  // Future migrations: add `else if (row.version < CURRENT_VERSION) { ... }` steps here
}
