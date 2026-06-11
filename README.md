Markdown
# Product Catalog — Fake Store API

Aplikasi Product Catalog berbasis React yang mengambil data dari Fake Store API untuk memenuhi tugas praktikum Pemrograman Web.

## Cara Menjalankan

**1. Clone repositori**
```bash
git clone [https://github.com/elvina04/praktikum-web-6-product-catalog.git](https://github.com/elvina04/praktikum-web-6-product-catalog.git)
cd praktikum-web-6-product-catalog
2. Install dependencies

Bash
npm install
3. Jalankan development server

Bash
npm run dev
Buka http://localhost:5173 di browser untuk melihat aplikasi.

Fitur yang Diimplementasikan
Fitur Wajib
[x] Product List — Menampilkan semua produk dari API (gambar, judul, harga, rating bintang).

[x] Loading Indicator — Skeleton loader saat data sedang diambil.

[x] Error Handling — Pesan error yang informatif jika request gagal.

[x] Category Filter — Filter produk berdasarkan kategori (diambil dari endpoint /categories).

[x] Search — Pencarian real-time berdasarkan judul produk.

[x] Product Detail Modal — Klik produk untuk melihat detail lengkap di modal.

[x] Responsive Grid — 4 kolom desktop, 2 kolom tablet, 1 kolom mobile.

Fitur Tambahan (3 dari 5)
[x] Sorting — Urutkan berdasarkan harga (termurah/termahal), rating, atau nama A–Z.

[x] Pagination — 8 produk per halaman dengan navigasi halaman.

[x] Add to Cart — Tambah produk ke keranjang dengan quantity control dan toast notification.

Fitur Bonus
[x] Price Range Filter — Filter produk berdasarkan harga maksimal (slider).

[x] Rating Filter — Filter produk berdasarkan rating minimum.

[x] Cart Sidebar — Keranjang belanja dengan update qty dan total harga.

Tech Stack
React 18 + Vite

Axios untuk HTTP requests

Custom Hook useAxios

Promise.all untuk concurrent API calls

Struktur Proyek
Plaintext
src/
├── components/
│   ├── ProductCatalog.jsx   # Komponen utama dengan semua logika
│   ├── ProductCard.jsx      # Kartu produk individual
│   ├── ProductModal.jsx     # Modal detail produk
│   ├── CartSidebar.jsx      # Sidebar keranjang belanja
│   └── Toast.jsx            # Notifikasi toast
├── hooks/
│   └── useAxios.js          # Custom hook untuk data fetching
├── App.jsx
├── main.jsx
└── index.css
