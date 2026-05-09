const express = require('express');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hair-istanbul-secret-key-change-in-production';
const ADMIN_PATH = '/admin-dashboard-secure-2024';

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '.')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again later.' }
});

app.use('/api', apiLimiter);

function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(403).json({ error: 'Invalid token.' });
  }
}

app.post('/api/login', authLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, is_permanent: user.is_permanent },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      is_permanent: !!user.is_permanent
    }
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.post('/api/visitor', (req, res) => {
  const { ip_address, user_agent } = req.body;
  
  if (!ip_address) {
    return res.status(400).json({ error: 'IP address is required.' });
  }

  const geo = geoip.lookup(ip_address);
  const country = geo?.country || null;
  const city = geo?.city || null;

  const stmt = db.prepare(`
    INSERT INTO visitors (ip_address, country, city, user_agent)
    VALUES (?, ?, ?, ?)
  `);

  try {
    stmt.run(ip_address, country, city, user_agent);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record visitor.' });
  }
});

app.post('/api/booking', (req, res) => {
  const { name, age, city, procedure, phone, country_code, ip_address } = req.body;

  if (!name || !age || !city || !procedure || !phone || !country_code || !ip_address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const geo = geoip.lookup(ip_address);
  const country = geo?.country || null;
  const cityLocation = geo?.city || null;

  const stmt = db.prepare(`
    INSERT INTO bookings (name, age, city, procedure, phone, country_code, ip_address, country, city_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(name, age, city, procedure, phone, country_code, ip_address, country, cityLocation);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save booking.' });
  }
});

app.get('/api/analytics/visitors', authenticateToken, (req, res) => {
  const { start_date, end_date } = req.query;

  let query = `
    SELECT 
      DATE(visited_at) as date,
      COUNT(*) as total_visitors,
      COUNT(DISTINCT ip_address) as unique_visitors
    FROM visitors
  `;

  const params = [];

  if (start_date && end_date) {
    query += ` WHERE DATE(visited_at) BETWEEN ? AND ?`;
    params.push(start_date, end_date);
  }

  query += ` GROUP BY DATE(visited_at) ORDER BY date ASC`;

  try {
    const data = db.prepare(query).all(...params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const bookings = db.prepare(`
      SELECT * FROM bookings
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(parseInt(limit), parseInt(offset));

    const total = db.prepare('SELECT COUNT(*) as count FROM bookings').get();

    res.json({ bookings, total: total.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

app.get('/api/users', authenticateToken, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, username, is_permanent, created_at
      FROM users
      ORDER BY created_at DESC
    `).all();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    db.prepare(`
      INSERT INTO users (username, password_hash, is_permanent)
      VALUES (?, ?, 0)
    `).run(username, passwordHash);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.is_permanent && user.username === 'm_uvex') {
      return res.status(403).json({ error: 'Cannot modify permanent user.' });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.is_permanent) {
      return res.status(403).json({ error: 'Cannot delete permanent user.' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

app.get(ADMIN_PATH, authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/api/auth/check', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.get('*', (req, res) => {
  if (req.path.startsWith(ADMIN_PATH)) {
    return res.sendFile(path.join(__dirname, 'dashboard-login.html'));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}${ADMIN_PATH}`);
});
