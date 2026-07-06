const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
router.get('/', protect, async (req, res) => {
    try {
        const [wishlist] = await db.query(`
            SELECT w.id, w.product_id, p.nama, p.harga, p.gambar 
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
        `, [req.user.id]);
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/wishlist
router.post('/', protect, async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if exists
        const [existing] = await db.query('SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Produk sudah ada di wishlist' });
        }

        await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, productId]);
        res.status(201).json({ message: 'Produk ditambahkan ke wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/wishlist/:productId
router.delete('/:productId', protect, async (req, res) => {
    try {
        await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
        res.json({ message: 'Produk dihapus dari wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
