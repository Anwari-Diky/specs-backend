const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer storage for banner
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'banner_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Create settings table if not exists
const initSettingsTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(50) PRIMARY KEY,
                setting_value TEXT
            )
        `);
    } catch (error) {
        console.error('Failed to create settings table:', error);
    }
};

// Call immediately
initSettingsTable();

// @route   GET /api/settings/banner
// @access  Public
router.get('/banner', async (req, res) => {
    try {
        const [settings] = await db.query("SELECT setting_value FROM settings WHERE setting_key = 'hero_banner'");
        if (settings.length > 0) {
            return res.json({ url: settings[0].setting_value });
        }
        res.json({ url: null });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/settings/banner
// @access  Admin
router.post('/banner', protect, admin, upload.single('banner'), async (req, res) => {
    try {
        let bannerUrl = null;
        if (req.file) {
            bannerUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (req.body.banner_url) {
            bannerUrl = req.body.banner_url; // Support direct URL fallback
        }

        if (!bannerUrl) {
            return res.status(400).json({ message: 'Tidak ada gambar yang diunggah' });
        }

        // Insert or update settings table (UPSERT logic for MySQL)
        await db.query(
            `INSERT INTO settings (setting_key, setting_value) 
             VALUES ('hero_banner', ?) 
             ON DUPLICATE KEY UPDATE setting_value = ?`,
            [bannerUrl, bannerUrl]
        );

        res.status(200).json({ message: 'Banner berhasil diperbarui', url: bannerUrl });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
