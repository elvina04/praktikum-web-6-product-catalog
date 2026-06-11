# Product Catalog — Fake Store API

Aplikasi Product Catalog berbasis React yang mengambil data dari [Fake Store API](https://fakestoreapi.com).

## Cara Menjalankan

# Clone repositori
git clone https://github.com/elvina04/praktikum-web-6-product-catalog.git
cd praktikum-web-6-product-catalog

# Install dependencies
npm install

# Jalankan development server
npm run dev

Buka http://localhost:5173 di browser.

## Fitur yang Diimplementasikan

### Fitur Wajib
- ✅ **Product List** — Menampilkan semua produk dari API (gambar, judul, harga, rating bintang)
- ✅ **Loading Indicator** — Skeleton loader saat data sedang diambil
- ✅ **Error Handling** — Pesan error yang informatif jika request gagal
- ✅ **Category Filter** — Filter produk berdasarkan kategori (diambil dari endpoint `/categories`)
- ✅ **Search** — Pencarian real-time berdasarkan judul produk
- ✅ **Product Detail Modal** — Klik produk untuk melihat detail lengkap di modal
- ✅ **Responsive Grid** — 4 kolom desktop, 2 kolom tablet, 1 kolom mobile

### Fitur Tambahan (3 dari 5)
- ✅ **Sorting** — Urutkan berdasarkan harga (termurah/termahal), rating, atau nama A–Z
- ✅ **Pagination** — 8 produk per halaman dengan navigasi halaman
- ✅ **Add to Cart** — Tambah produk ke keranjang dengan quantity control dan toast notification

### Fitur Bonus
- ✅ **Price Range Filter** — Filter produk berdasarkan harga maksimal (slider)
- ✅ **Rating Filter** — Filter produk berdasarkan rating minimum
- ✅ **Cart Sidebar** — Keranjang belanja dengan update qty dan total harga

## Tech Stack
- React 18 + Vite
- Axios untuk HTTP requests
- Custom Hook `useAxios`
- Promise.all untuk concurrent API calls

## Struktur Proyek
```
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
```
