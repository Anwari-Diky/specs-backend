const db = require('./config/db');

async function seedAdmin() {
    try {
        await db.execute('DELETE FROM users WHERE email = ?', ['admin@gmail.com']);
        
        await db.execute(
            'INSERT INTO users (id, nama, email, password, role) VALUES (?, ?, ?, ?, ?)',
            ['admin-1', 'Administrator', 'admin@gmail.com', '$2b$10$OP2uxrZOW2FzwrX1gA/vMuyNyFUJhkTHa6f99rJ2wIwRNfGA/zZXu', 'admin']
        );
        
        console.log('Admin account created successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedAdmin();
