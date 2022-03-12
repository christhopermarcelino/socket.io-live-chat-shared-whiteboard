# Aplikasi Real Time Chat and Whiteboard dengan Socket.IO

## Teknologi
Frontend  : Tailwindcss  
Backend   : Express JS

## Cara install
```
git clone https://github.com/christhopermarcelino/socket.io-live-chat-shared-whiteboard.git
cd socket.io-live-chat-shared-whiteboard
yarn start
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

### Masuk room
Untuk memasuki sebuah room, anda diminta untuk mengisikan username dan nama room.
Terdapat beberapa batasan ketika bergabung ke dalam sebuah room, di antaranya:
1. Username yang sama tidak dapat bergabung dalam satu room
2. Room yang belum dibuat tidak bisa dimasuki
3. Room yang private tidak bisa dimasuki
