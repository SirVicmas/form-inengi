require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

// Body parser MUST come before any routes that read req.body
app.use(express.json());

// Health check — Docker, load balancers, and Kubernetes all poll
// an endpoint like this to know if a container is alive and ready.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'form-inengi-backend' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/events');
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});