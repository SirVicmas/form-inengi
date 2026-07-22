const express = require('express');
const prisma = require('../config/db');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

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

module.exports = router;