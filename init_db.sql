

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    harga DECIMAL(15,2) NOT NULL,
    kategori VARCHAR(100),
    gambar VARCHAR(255),
    deskripsi TEXT,
    stok INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 4.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    total_harga DECIMAL(15,2) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL,
    status ENUM('Pending', 'Diproses', 'Selesai') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50),
    nama VARCHAR(255) NOT NULL,
    harga DECIMAL(15,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Insert Default Admin User
INSERT IGNORE INTO users (id, nama, email, password, role)
VALUES ('admin-1', 'Administrator', 'admin@gmail.com', '$2b$10$OP2uxrZOW2FzwrX1gA/vMuyNyFUJhkTHa6f99rJ2wIwRNfGA/zZXu', 'admin');

-- Default Products Seed
DELETE FROM products;
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('PRD-1', 'Specs Accelerator Lightspeed', 550000.00, 'Sepatu Bola', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400', 'Sepatu bola specs accelerator lightspeed original.', 15, 4.8, '2026-07-06 13:21:17');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('PRD-2', 'Specs Metasala', 450000.00, 'Sepatu Futsal', 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=400', 'Sepatu futsal specs metasala terbaik.', 10, 4.5, '2026-07-06 13:21:17');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('prod_1783345159819', 'Sepatu Bola Specs Lightspeed Reborn FG Black Pale Gold Free Box', 600000.00, 'Sepatu Bola', 'https://specs-backend-production.up.railway.app/uploads/1783345159788.webp', 'epatu Bola Specs Lightspeed Reborn FG Black Pale Gold adalah pilihan sempurna untuk pemain bola yang mencari kombinasi kualitas dan gaya.



Desain Menarik: Sepatu ini memiliki motif dan warna yang permanen, cocok digunakan oleh anak-anak hingga dewasa.



ukuran 33 34 35 36 37 38 39 40 41 42 43

33 panjang 19cm

34 panjang 20cm

35 panjang 21cm

36 panjang 22cm

37 panjang 23cm

38 panjang 24cm

39 panjang 25cm

40 panjang 26cm

41 panjang 27cm

42 panjang 28cm

43 panjang 29cm



Kenyamanan Optimal: Dibuat dengan bahan PVC Bening, Linning, Spons, Eva, dan PU untuk memberikan kenyamanan maksimal selama pertandingan.



Kelengkapan: Dikemas dengan kotak untuk penyimpanan yang praktis setelah digunakan.



Diproduksi di Indonesia oleh brand Specs dengan teknologi terkini dalam industri sepatu olahraga. Tersedia dalam ukuran 33-43 dan menggunakan tali sebagai pengencangnya. Sesuai digunakan oleh pemain bola laki-laki di semua musim!.', 10, 5.0, '2026-07-06 13:39:19');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('prod_1783345322353', 'icon arrow left boldicon arrow right bold Share:   Favorit (8) specs ls reborn in', 650000.00, 'Sepatu Futsal', 'https://specs-backend-production.up.railway.app/uploads/1783345322341.webp', '', 20, 5.0, '2026-07-06 13:42:02');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('prod_1783346514350', 'SPECS LS REBORN WHITE GOLD FG SECOND SIZE 41', 528000.00, 'Sepatu Bola', 'https://specs-backend-production.up.railway.app/uploads/1783346514301.webp', '', 15, 5.0, '2026-07-06 14:01:54');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('prod_1783346590695', 'IG PROMO sepatubola spec lighspeed reborn terbaru murah berkualitas', 450000.00, 'Sepatu Bola', 'https://specs-backend-production.up.railway.app/uploads/1783346590680.webp', '', 5, 4.5, '2026-07-06 14:03:10');
INSERT INTO products (id, nama, harga, kategori, gambar, deskripsi, stok, rating, created_at) VALUES ('prod_1783346694588', 'SEPATU BOLA DAN FUTSAL LS REBORN LIGHTEST SKY/GREEN BUG', 600000.00, 'Sepatu Futsal', 'https://specs-backend-production.up.railway.app/uploads/1783346694576.webp', '', 10, 5.0, '2026-07-06 14:04:54');
