# Deensbite Landing Page

Landing page Deensbite menggunakan HTML, CSS, dan vanilla JavaScript.

## Struktur

- `index.html` — struktur halaman, header, hero, katalog, footer, cart, dan checkout.
- `css/style.css` — seluruh styling dan responsive breakpoints.
- `js/products.js` — data produk, harga, gambar, warna, dan status stok.
- `js/app.js` — katalog, keranjang, checkout, dan pembentukan pesan WhatsApp.
- `assets/images/` — simpan foto produk di sini.

## Menjalankan

Buka folder `deensbite` di VS Code, lalu jalankan `index.html` menggunakan Live Server atau hosting statis.

## Pengaturan penting

1. Ubah `WHATSAPP_NUMBER` di `js/app.js` ke nomor WhatsApp admin dengan format internasional tanpa `+`, spasi, atau tanda hubung.
2. Ubah link Instagram, TikTok, dan Facebook Page di `index.html`.
3. Ubah `available: true` menjadi `available: false` di `js/products.js` jika produk habis.
4. Pastikan nama file foto di `js/products.js` sesuai dengan file yang ada di `assets/images/`.

## Responsive

CSS telah disusun ulang tanpa aturan duplikat yang saling menimpa. Layout diuji secara struktur untuk breakpoint desktop, tablet (900px), mobile (600px), dan layar kecil (380px). Tetap lakukan pengujian visual di perangkat/browser target.

## Catatan

- Keranjang berjalan di browser masing-masing pengunjung.
- Checkout membuka WhatsApp dengan pesan yang sudah diisi; pelanggan tetap perlu menekan tombol kirim.
- Stok belum tersinkronisasi antar pengunjung karena belum menggunakan backend/database.
- Ongkir belum dihitung otomatis.
