const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/products
// @access  Admin
router.post('/', protect, admin, upload.single('gambar'), async (req, res) => {
    try {
        const { id, nama, harga, kategori, deskripsi, stok, rating } = req.body;
        const productId = id || `prod_${Date.now()}`;
        
        let gambarUrl = req.body.gambar || 'https://placehold.co/400x400?text=Produk';
        if (req.file) {
            gambarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            'INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [productId, nama, harga, kategori, gambarUrl, deskripsi, stok, rating || 4.0]
        );

        res.status(201).json({ message: 'Produk berhasil ditambahkan', id: productId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/products/:id
// @access  Admin
router.put('/:id', protect, admin, upload.single('gambar'), async (req, res) => {
    try {
        const { nama, harga, kategori, deskripsi, stok, rating } = req.body;
        let gambarUrl = req.body.gambar;
        if (req.file) {
            gambarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        
        const [result] = await db.query(
            'UPDATE products SET nama=?, harga=?, kategori=?, gambar=?, deskripsi=?, stok=?, rating=? WHERE id=?',
            [nama, harga, kategori, gambarUrl, deskripsi, stok, rating, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @access  Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
