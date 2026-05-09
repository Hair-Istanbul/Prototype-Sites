const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'hair_istanbul_db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  users: [],
  visitors: [],
  bookings: []
});

async function initializeDatabase() {
  await db.read();
  
  db.data = db.data || {
    users: [],
    visitors: [],
    bookings: []
  };

  const permanentUser = db.data.users.find(u => u.username === 'm_uvex');
  
  if (!permanentUser) {
    const passwordHash = bcrypt.hashSync('040810MUSAmurad@..', 12);
    db.data.users.push({
      id: Date.now(),
      username: 'm_uvex',
      password_hash: passwordHash,
      is_permanent: true,
      created_at: new Date().toISOString()
    });
  }

  const adminUser = db.data.users.find(u => u.username === 'admin');
  
  if (!adminUser) {
    const passwordHash = bcrypt.hashSync('admin123', 12);
    db.data.users.push({
      id: Date.now() + 1,
      username: 'admin',
      password_hash: passwordHash,
      is_permanent: false,
      created_at: new Date().toISOString()
    });
  }

  await db.write();
}

initializeDatabase();

module.exports = db;
