const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user by ID (Admin only)
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (users.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user role (Admin only)
router.put('/:id/role', protect, admin, async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Role tidak valid. Gunakan "user" atau "admin"' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        
        res.json({ message: 'Role user berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete user (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
