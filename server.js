const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Temporary route to sync database
const fs = require('fs');
const db = require('./config/db');
app.get('/api/sync-db', async (req, res) => {
    try {
        const sqlPath = path.join(__dirname, 'init_db.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');
        await db.query(sqlQuery);
        res.json({ message: 'Database successfully synced to match local products!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Temporary route to initialize DB on Railway
app.get('/api/init-db', async (req, res) => {
    try {
        const fs = require('fs');
        const db = require('./config/db');
        const sqlPath = path.join(__dirname, 'init_db.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');
        
        // MySQL connection from pool might not support multipleStatements by default,
        // but we can create a temporary connection
        const mysql = require('mysql2/promise');
        const tempConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        
        await tempConn.query(sqlQuery);
        await tempConn.end();
        
        res.send('<h1>✅ Database berhasil di-inisialisasi dengan tabel dan akun admin!</h1>');
    } catch (error) {
        res.status(500).send('<h1>❌ Gagal inisialisasi:</h1><pre>' + error.message + '</pre>');
    }
});

// Base route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
