const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Deliberately vague error on both "no such admin" and "wrong password" —
    // telling an attacker which one was wrong helps them guess valid emails.
    if (!admin) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { adminId: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );

    res.json({ token });
});

module.exports = router;