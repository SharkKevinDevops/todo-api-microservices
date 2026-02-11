// ======================================
// Simple API Gateway for Kubernetes
// ======================================

const express = require('express');
const app = express();

// ======================================
// Configuration
// ======================================

// In Kubernetes, these should point to service names:
// e.g. http://read-service:3001
const READ_SERVICE_URL =
  process.env.READ_SERVICE_URL || 'http://read-service:3001';

const WRITE_SERVICE_URL =
  process.env.WRITE_SERVICE_URL || 'http://write-service:3002';

const PORT = process.env.PORT || 3000;

// ======================================
// Middleware
// ======================================

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// ======================================
// Reusable Proxy Function
// ======================================

async function proxyRequest(req, res, targetUrl, options = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(targetUrl, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeout);

    const contentType = response.headers.get('content-type') || '';

    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || response.statusText
      });
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Service communication error:', error.message);
    res.status(502).json({ error: 'Upstream service unavailable' });
  }
}

// ======================================
// Routes
// ======================================

// GET → Read service
app.get('/items', (req, res) => {
  proxyRequest(req, res, `${READ_SERVICE_URL}/items`);
});

app.get('/items/:id', (req, res) => {
  proxyRequest(req, res, `${READ_SERVICE_URL}/items/${req.params.id}`);
});

// POST → Write service
app.post('/items', (req, res) => {
  proxyRequest(req, res, `${WRITE_SERVICE_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
});

// PUT → Write service
app.put('/items/:id', (req, res) => {
  proxyRequest(req, res, `${WRITE_SERVICE_URL}/items/${req.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
});

// DELETE → Write service
app.delete('/items/:id', (req, res) => {
  proxyRequest(
    req,
    res,
    `${WRITE_SERVICE_URL}/items/${req.params.id}`,
    { method: 'DELETE' }
  );
});

// ======================================
// Health Endpoints (Important for K8s)
// ======================================

// Liveness probe (container is alive)
app.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe (ready to receive traffic)
app.get('/health/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

// ======================================
// Start Server
// ======================================

app.listen(PORT, () => {
  console.log(`Frontend Gateway running on port ${PORT}`);
});