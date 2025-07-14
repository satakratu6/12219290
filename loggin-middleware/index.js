// Minimal Express backend for Afford URL Shortener (inside loggin-middleware)
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for shortened URLs (for demo; use DB in prod)
const urlMap = new Map();
const statsMap = new Map();

// Shorten URLs endpoint
app.post('/api/shorten', (req, res) => {
  const { urls } = req.body;
  if (!Array.isArray(urls)) return res.status(400).json({ error: 'Invalid input' });
  const results = urls.map(({ longUrl, validity = 30, shortcode }) => {
    if (!longUrl) return { error: 'Missing longUrl' };
    let code = shortcode || Math.random().toString(36).substring(2, 8);
    // Ensure uniqueness
    while (urlMap.has(code)) {
      code = Math.random().toString(36).substring(2, 8);
    }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + validity * 60000);
    urlMap.set(code, { longUrl, createdAt: now, expiresAt });
    statsMap.set(code, { clicks: 0, logs: [] });
    return {
      shortUrl: `http://localhost:5173/${code}`,
      originalUrl: longUrl,
      createdAt: now,
      expiresAt,
      shortcode: code
    };
  });
  res.json(results);
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = Array.from(urlMap.entries()).map(([code, { longUrl, createdAt, expiresAt }]) => {
    const s = statsMap.get(code) || { clicks: 0, logs: [] };
    return {
      shortUrl: `http://localhost:5173/${code}`,
      originalUrl: longUrl,
      createdAt,
      expiresAt,
      clicks: s.clicks,
      logs: s.logs
    };
  });
  res.json(stats);
});

// Redirect endpoint (for client to fetch original URL)
app.get('/api/:code', (req, res) => {
  const { code } = req.params;
  const entry = urlMap.get(code);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  // Log click
  const stat = statsMap.get(code);
  if (stat) {
    stat.clicks++;
    stat.logs.push({ timestamp: new Date(), source: req.headers['user-agent'] });
  }
  res.json({ longUrl: entry.longUrl });
});

// Logging endpoint (proxy for frontend logs)
const { logEvent } = require('./logger.node.js');
app.post('/api/log', async (req, res) => {
  try {
    const { stack, level, pkg, message, token } = req.body;
    await logEvent({ token, stack, level, pkg, message });
    res.json({ message: 'Log sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logging failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
