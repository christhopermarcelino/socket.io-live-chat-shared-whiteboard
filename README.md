# Aplikasi Real Time Chat and Whiteboard dengan Socket.IO

## Teknologi
Frontend  : Tailwindcss  
Backend   : Express JS

## Cara install
```
git clone https://github.com/christhopermarcelino/socket.io-live-chat-shared-whiteboard.git
cd socket.io-live-chat-shared-whiteboard

npm run npmStart // jika anda menggunakan npm
yarn run yarnStart // jika anda menggunakan yarn
```
Aplikasi dapat diakses di `http://localhost:3001/`

## Deskripsi Aplikasi
Aplikasi ini menyediakan layanan real-time chat dan whiteboard menggunakan Socket.IO.
Terdapat dua fasilitas yang tersedia, yaitu membuat room and masuk room.

### Membuat room
Ketika membuat room, anda diminta mengisikan username dan nama room serta mengonfigurasi room.
Terdapat dua konfigurasi, di antaranya:
1. Public/Private -> menentukan apakah room bisa diakses oleh publik
2. Opened/Restricted -> menentukan apakah whiteboard bisa digambar oleh publik  

Sebagai pembuat room, anda memiliki kebebasan memilih warna pensil saat menggambar di canvas pada mode restricted room. Sedangkan pada public dan opened room, warna pensil anda akan teracak secara otomatis.

### Masuk room
Untuk memasuki sebuah room, anda diminta untuk mengisikan username dan nama room.
Terdapat beberapa batasan ketika bergabung ke dalam sebuah room, di antaranya:
1. Username yang sama tidak dapat bergabung dalam satu room
2. Room yang belum dibuat tidak bisa dimasuki
3. Room yang private tidak bisa dimasuki  

Ketika memasuki public dan opened room, warna pensil anda akan teracak secara otomatis

## Kekurangan
- Program masih belum modular
- Struktur program masih berantakan

## Masalah
- Feedback badge pada halaman create room dan join room belum bisa di-toggle untuk hidden
- Penggambaran pada canvas tidak sesuai posisi cursor
- Halaman masih belum responsif

## Pengembangan Lebih Lanjut
- Penambahan password pada private room
- Memungkinkan konfigurasi room diganti setelah room dibuat
