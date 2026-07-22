const express = require('express');
const prisma = require('../config/db');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// PROTECTED — admin: list all tickets, optionally filtered by event
router.get('/', requireAdmin, async (req, res) => {
    try {
        const { eventId } = req.query;
        const parsedEventId = eventId ? Number(eventId) : undefined;

        if (eventId && isNaN(parsedEventId)) {
            return res.status(400).json({ error: 'eventId must be a valid number' });
        }

        const tickets = await prisma.ticket.findMany({
            where: parsedEventId ? { eventId: parsedEventId } : undefined,
            include: { event: true },
            orderBy: { createdAt: 'desc' },
        });

        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// PROTECTED — admin: check in a ticket by its code (this is what a QR scan resolves to)
router.post('/:code/checkin', requireAdmin, async (req, res) => {
    try {
        const ticket = await prisma.ticket.findUnique({ where: { ticketCode: req.params.code } });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.status === 'checked_in') {
            return res.status(409).json({
                error: 'This ticket has already been checked in',
                checkedInAt: ticket.checkedInAt,
            });
        }

        if (ticket.status === 'cancelled') {
            return res.status(409).json({ error: 'This ticket was cancelled' });
        }

        const updated = await prisma.ticket.update({
            where: { ticketCode: req.params.code },
            data: { status: 'checked_in', checkedInAt: new Date() },
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to check in ticket' });
    }
});

module.exports = router;