const express = require('express');
const QRCode = require('qrcode');
const prisma = require('../config/db');
const generateTicketCode = require('../utils/ticketCode');

const router = express.Router();

// Generates a code, and retries if it happens to already exist in the database.
async function generateUniqueTicketCode() {
    const MAX_ATTEMPTS = 5;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const code = generateTicketCode();
        const existing = await prisma.ticket.findUnique({ where: { ticketCode: code } });
        if (!existing) {
            return code;
        }
    }

    throw new Error('Could not generate a unique ticket code after several attempts');
}

// PUBLIC — register for an event, get back a ticket + QR code
router.post('/:slug/register', async (req, res) => {
    const { attendeeName, phone, email } = req.body;

    if (!attendeeName || !phone) {
        return res.status(400).json({ error: 'attendeeName and phone are required' });
    }

    const event = await prisma.event.findUnique({ where: { slug: req.params.slug } });

    if (!event || event.status !== 'published') {
        return res.status(404).json({ error: 'Event not found' });
    }

    if (event.capacity) {
        const ticketCount = await prisma.ticket.count({
            where: { eventId: event.id, status: { not: 'cancelled' } },
        });
        if (ticketCount >= event.capacity) {
            return res.status(409).json({ error: 'This event is fully booked' });
        }
    }

    try {
        const ticketCode = await generateUniqueTicketCode();

        const ticket = await prisma.ticket.create({
            data: {
                ticketCode,
                attendeeName,
                phone,
                email,
                eventId: event.id,
            },
        });

        const qrDataUrl = await QRCode.toDataURL(ticket.ticketCode);

        res.status(201).json({ ticket, qrCode: qrDataUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong creating your ticket' });
    }
});

module.exports = router;