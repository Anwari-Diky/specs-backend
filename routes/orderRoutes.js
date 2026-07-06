const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders/checkout
router.post('/checkout', protect, async (req, res) => {
    try {
        const { items, totalHarga, pengiriman } = req.body;
        const orderId = `TRX-${Date.now()}`;

        // Insert order
        await db.query(
            'INSERT INTO orders (id, user_id, total_harga, nama_lengkap, alamat, nomor_hp) VALUES (?, ?, ?, ?, ?, ?)',
            [orderId, req.user.id, totalHarga, pengiriman.namaLengkap, pengiriman.alamat, pengiriman.nomorHP]
        );

        // Insert items
        for (let item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, nama, harga, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.nama, item.harga, item.quantity, item.subtotal || (item.harga * item.quantity)]
            );
        }

        // Clear user cart
        await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

        // Generate WhatsApp Message
        const ownerNumber = process.env.WA_OWNER_NUMBER || '6281234567890';
        let waText = `*Halo, saya ingin memesan produk (Order ID: ${orderId})*\n\n`;
        waText += `*Data Pengiriman:*\n`;
        waText += `- Nama: ${pengiriman.namaLengkap}\n`;
        waText += `- No. HP: ${pengiriman.nomorHP}\n`;
        waText += `- Alamat: ${pengiriman.alamat}\n\n`;
        waText += `*Detail Pesanan:*\n`;
        
        items.forEach((item, index) => {
            const sub = item.subtotal || (item.harga * item.quantity);
            waText += `${index + 1}. ${item.nama} (${item.quantity}x) - Rp${sub.toLocaleString('id-ID')}\n`;
        });
        
        waText += `\n*Total Pembayaran: Rp${totalHarga.toLocaleString('id-ID')}*\n\n`;
        waText += `Mohon info ketersediaan stok dan metode pembayaran. Terima kasih.`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${ownerNumber}&text=${encodeURIComponent(waText)}`;

        res.status(201).json({ 
            message: 'Checkout berhasil', 
            orderId,
            whatsappUrl
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/orders
// @desc    Get user orders or all orders if admin
router.get('/', protect, async (req, res) => {
    try {
        let ordersQuery;
        let params = [];

        if (req.user.role === 'admin') {
            ordersQuery = 'SELECT * FROM orders ORDER BY created_at DESC';
        } else {
            ordersQuery = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
            params.push(req.user.id);
        }

        const [orders] = await db.query(ordersQuery, params);
        
        // fetch items for each order
        for (let i = 0; i < orders.length; i++) {
            const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orders[i].id]);
            orders[i].items = items;
            orders[i].pengiriman = {
                namaLengkap: orders[i].nama_lengkap,
                alamat: orders[i].alamat,
                nomorHP: orders[i].nomor_hp
            };
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/orders/:id/status
// @access  Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status pesanan diupdate' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
