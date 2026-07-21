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

const prisma = require('./config/db');

// Temporary test route — we'll delete this once real routes exist.
app.post('/api/test-event', async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: {
        title: 'Test Event via API',
        slug: `test-event-${Date.now()}`,
        description: 'Created through Express + Prisma, not Studio.',
      },
    });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});