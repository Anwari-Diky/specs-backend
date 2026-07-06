const db = require('./config/db');

const initialProducts = [
  {
    id: 'PRD-1',
    nama: 'Specs Accelerator Lightspeed',
    harga: 550000,
    kategori: 'Sepatu Bola',
    stok: 15,
    gambar: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400',
    deskripsi: 'Sepatu bola specs accelerator lightspeed original.',
    rating: 4.8
  },
  {
    id: 'PRD-2',
    nama: 'Specs Metasala',
    harga: 450000,
    kategori: 'Sepatu Futsal',
    stok: 10,
    gambar: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=400',
    deskripsi: 'Sepatu futsal specs metasala terbaik.',
    rating: 4.5
  }
];

async function seed() {
    try {
        // Clear products
        await db.execute('DELETE FROM products');
        
        // Insert products
        for (const p of initialProducts) {
            await db.execute(
                'INSERT INTO products (id, nama, harga, kategori, stok, gambar, deskripsi, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.id, p.nama, p.harga, p.kategori, p.stok, p.gambar, p.deskripsi, p.rating]
            );
        }
        
        console.log('Products seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
