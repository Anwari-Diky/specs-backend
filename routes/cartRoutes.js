const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/cart
router.get('/', protect, async (req, res) => {
    try {
        const [cartItems] = await db.query(`
            SELECT c.id, c.product_id, c.quantity, p.nama, p.harga, p.gambar, p.stok 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `, [req.user.id]);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/cart
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Check if item exists in cart
        const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
        
        if (existing.length > 0) {
            await db.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing[0].id]);
        } else {
            await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, productId, quantity || 1]);
        }
        
        res.status(201).json({ message: 'Produk ditambahkan ke keranjang' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/cart/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const { quantity } = req.body;
        await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
        res.json({ message: 'Keranjang diupdate' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/cart/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Item dihapus dari keranjang' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
