require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check — Docker, load balancers, and Kubernetes all poll
// an endpoint like this to know if a container is alive and ready.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'form-inengi-backend' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});