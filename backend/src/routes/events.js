const express = require('express');
const prisma = require('../config/db');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// PROTECTED — dashboard: see every event, including drafts and closed events
router.get('/admin/all', requireAdmin, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: [{ eventDate: 'asc' }, { createdAt: 'desc' }],
        });
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// PUBLIC — anyone can list published events (the public site uses this)
router.get('/', async (req, res) => {
    const events = await prisma.event.findMany({
        where: { status: 'published' },
        orderBy: { eventDate: 'asc' },
    });
    res.json(events);
});

// PUBLIC — get one event by slug (for the ticket detail page)
router.get('/:slug', async (req, res) => {
    const event = await prisma.event.findUnique({
        where: { slug: req.params.slug },
    });

    if (!event || event.status !== 'published') {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
});

// PROTECTED — only an authenticated admin can create an event
router.post('/', requireAdmin, async (req, res) => {
    const { title, slug, description, venue, eventDate, capacity, status } = req.body;

    if (!title || !slug || !description) {
        return res.status(400).json({ error: 'title, slug, and description are required' });
    }

    try {
        const event = await prisma.event.create({
            data: {
                title,
                slug,
                description,
                venue,
                eventDate: eventDate ? new Date(eventDate) : null,
                capacity,
                status: status || 'draft',
            },
        });
        res.status(201).json(event);
    } catch (err) {
        if (err.code === 'P2002') {
            // Prisma's error code for "unique constraint violated"
            return res.status(409).json({ error: 'An event with that slug already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Something went wrong creating the event' });
    }
});

// PROTECTED — dashboard: update event details or publishing status
router.patch('/:id', requireAdmin, async (req, res) => {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId)) {
        return res.status(400).json({ error: 'Event id must be a valid number' });
    }

    const { title, slug, description, venue, eventDate, capacity, status } = req.body;
    const allowedStatuses = ['draft', 'published', 'closed'];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'status must be draft, published, or closed' });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (venue !== undefined) data.venue = venue;
    if (eventDate !== undefined) data.eventDate = eventDate ? new Date(eventDate) : null;
    if (capacity !== undefined) data.capacity = capacity === null ? null : Number(capacity);
    if (status !== undefined) data.status = status;

    try {
        const event = await prisma.event.update({ where: { id: eventId }, data });
        res.json(event);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Event not found' });
        if (err.code === 'P2002') return res.status(409).json({ error: 'An event with that slug already exists' });
        console.error(err);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

module.exports = router;
