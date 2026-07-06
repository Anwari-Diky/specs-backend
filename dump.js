const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function dump() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    });
    
    const [rows] = await conn.query('SELECT * FROM products');
    let sql = '\n-- Default Products Seed\nDELETE FROM products;\n';
    rows.forEach(r => {
        const gambar = r.gambar.replace('http://localhost:5000', 'https://specs-backend-production.up.railway.app');
        sql += `INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('${r.id}', '${r.nama.replace(/'/g, "''")}', ${r.harga}, '${r.kategori}', '${gambar}', '${r.deskripsi.replace(/'/g, "''")}', ${r.stok}, ${r.rating}, '${r.created_at.toISOString().slice(0,19).replace('T', ' ')}');\n`;
    });
    
    fs.appendFileSync('init_db.sql', sql);
    console.log('Appended product seeds to init_db.sql');
    await conn.end();
}
dump();
