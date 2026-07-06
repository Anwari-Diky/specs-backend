const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDB() {
    console.log('Menghubungkan ke database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true // Penting agar bisa run init_db.sql yang isinya banyak
        });

        console.log('Berhasil terhubung!');
        
        const sqlPath = path.join(__dirname, 'init_db.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

        console.log('Sedang membuat tabel dan data admin...');
        await connection.query(sqlQuery);

        console.log('🎉 SUKSES! Database Railway Anda sudah siap digunakan.');
        await connection.end();
    } catch (error) {
        console.error('❌ GAGAL:', error.message);
    }
}

setupDB();
