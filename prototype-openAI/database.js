const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'hair_istanbul.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_permanent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      country TEXT,
      city TEXT,
      user_agent TEXT,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      city TEXT NOT NULL,
      procedure TEXT NOT NULL,
      phone TEXT NOT NULL,
      country_code TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      country TEXT,
      city_location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
    CREATE INDEX IF NOT EXISTS idx_visitors_date ON visitors(visited_at);
    CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(created_at);
    CREATE INDEX IF NOT EXISTS idx_bookings_ip ON bookings(ip_address);
  `);

  const permanentUser = db.prepare('SELECT * FROM users WHERE username = ?').get('m_uvex');
  
  if (!permanentUser) {
    const passwordHash = bcrypt.hashSync('040810MUSAmurad@..', 12);
    db.prepare(`
      INSERT INTO users (username, password_hash, is_permanent)
      VALUES (?, ?, 1)
    `).run('m_uvex', passwordHash);
  }

  const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  
  if (!adminUser) {
    const passwordHash = bcrypt.hashSync('admin123', 12);
    db.prepare(`
      INSERT INTO users (username, password_hash, is_permanent)
      VALUES (?, ?, 0)
    `).run('admin', passwordHash);
  }
}

initializeDatabase();

module.exports = db;
