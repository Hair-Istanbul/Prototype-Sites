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

app.post('/api/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  await db.read();
  const user = db.data.users.find(u => u.username === username);

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

app.post('/api/visitor', async (req, res) => {
  const { ip_address, user_agent } = req.body;
  
  if (!ip_address) {
    return res.status(400).json({ error: 'IP address is required.' });
  }

  const geo = geoip.lookup(ip_address);
  const country = geo?.country || null;
  const city = geo?.city || null;

  try {
    await db.read();
    db.data.visitors.push({
      id: Date.now(),
      ip_address,
      country,
      city,
      user_agent,
      visited_at: new Date().toISOString()
    });
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record visitor.' });
  }
});

app.post('/api/booking', async (req, res) => {
  const { name, age, city, procedure, phone, country_code, ip_address } = req.body;

  if (!name || !age || !city || !procedure || !phone || !country_code || !ip_address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const geo = geoip.lookup(ip_address);
  const country = geo?.country || null;
  const cityLocation = geo?.city || null;

  try {
    await db.read();
    db.data.bookings.push({
      id: Date.now(),
      name,
      age,
      city,
      procedure,
      phone,
      country_code,
      ip_address,
      country,
      city_location: cityLocation,
      created_at: new Date().toISOString()
    });
    await db.write();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save booking.' });
  }
});

app.get('/api/analytics/visitors', authenticateToken, async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    await db.read();
    let visitors = db.data.visitors;

    if (start_date && end_date) {
      visitors = visitors.filter(v => {
        const visitDate = new Date(v.visited_at).toISOString().split('T')[0];
        return visitDate >= start_date && visitDate <= end_date;
      });
    }

    const grouped = {};
    visitors.forEach(v => {
      const date = new Date(v.visited_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, total_visitors: 0, unique_visitors: new Set() };
      }
      grouped[date].total_visitors++;
      grouped[date].unique_visitors.add(v.ip_address);
    });

    const data = Object.values(grouped).map(g => ({
      date: g.date,
      total_visitors: g.total_visitors,
      unique_visitors: g.unique_visitors.size
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

app.get('/api/bookings', authenticateToken, async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    await db.read();
    const bookings = db.data.bookings
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    const total = db.data.bookings.length;

    res.json({ bookings, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    await db.read();
    const users = db.data.users
      .map(u => ({
        id: u.id,
        username: u.username,
        is_permanent: u.is_permanent,
        created_at: u.created_at
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    await db.read();
    const existingUser = db.data.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    db.data.users.push({
      id: Date.now(),
      username,
      password_hash: passwordHash,
      is_permanent: false,
      created_at: new Date().toISOString()
    });
    await db.write();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = db.data.users[userIndex];

    if (user.is_permanent && user.username === 'm_uvex') {
      return res.status(403).json({ error: 'Cannot modify permanent user.' });
    }

    const passwordHash = bcrypt.hashSync(password, 12);
    db.data.users[userIndex].password_hash = passwordHash;
    await db.write();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = db.data.users[userIndex];

    if (user.is_permanent) {
      return res.status(403).json({ error: 'Cannot delete permanent user.' });
    }

    db.data.users.splice(userIndex, 1);
    await db.write();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

app.get(ADMIN_PATH, (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.sendFile(path.join(__dirname, 'dashboard-login.html'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  } catch (error) {
    res.clearCookie('token');
    res.sendFile(path.join(__dirname, 'dashboard-login.html'));
  }
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
