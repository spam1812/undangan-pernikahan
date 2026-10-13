# Undangan Pernikahan Aufa & Mrs. X

Website HTML, CSS, dan JavaScript tanpa instalasi dependensi.

## Melihat website

Klik dua kali `index.html` untuk membuka langsung di browser (Chrome, Edge, Firefox, atau Safari). Klik **Buka Undangan**. Musik diaktifkan dengan tombol nada di kanan bawah.

Untuk server lokal, jika Python tersedia, buka terminal di folder proyek dan jalankan:

```powershell
python -m http.server 8000
```

Buka http://localhost:8000. Hentikan server dengan Ctrl+C. Untuk preview ukuran smartphone, gunakan mode perangkat di Developer Tools browser (F12).

## Mengganti konten

- `index.html`: nama, keluarga, tanggal, lokasi, tautan Google Maps, dan URL foto.
- `style.css`: warna ada di `:root`, serta tata letak dan tipografi.
- `script.js`: ubah `weddingDate` sesuai tanggal acara, dengan zona waktu `+07:00` untuk WIB.
- Ganti URL gambar dengan file foto sendiri, misalnya `assets/pasangan.jpg`, lalu simpan file tersebut di folder `assets`.
- Nama tamu dapat dipersonalisasi melalui `index.html?to=Bapak%20Andi`.

## Perilaku demo

RSVP dan ucapan hanya tersimpan di localStorage browser yang digunakan, maksimal 100 ucapan terbaru. Tidak ada backend dan tidak ada pengiriman kepada mempelai. Ketika penyimpanan browser diblokir, ucapan tetap tampil selama halaman dibuka.

Musik berupa melodi instrumental sintetis yang dibuat melalui Web Audio. Klik tombol musik untuk menyalakan atau mematikan. Tidak ada autoplay.

Nama, keluarga, tempat, tanggal dan foto adalah placeholder. Lokasi Google Maps saat ini menuju Jakarta Selatan. Foto Unsplash dan font Google memerlukan internet; font sistem tetap digunakan jika Google Fonts tidak tersedia. Untuk penggunaan offline penuh, simpan foto dan font sendiri secara lokal.
