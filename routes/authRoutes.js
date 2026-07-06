const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { id, nama, email, password } = req.body;
        
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = id || `user_${Date.now()}`;

        await db.query(
            'INSERT INTO users (id, nama, email, password) VALUES (?, ?, ?, ?)',
            [userId, nama, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registrasi berhasil', id: userId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey123', {
            expiresIn: '30d'
        });

        res.json({
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, nama, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
