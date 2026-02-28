# 🍽️ RestoApp – Self Ordering Restaurant System

RestoApp adalah aplikasi pemesanan makanan di restoran berbasis **self-ordering** menggunakan tablet di setiap meja.  
Sistem ini dirancang untuk mempermudah alur pemesanan antara **pelanggan (guest)**, **chef**, **kasir**, dan **owner/admin** secara real-time.

---

## 📌 Tujuan Project
Project ini dibuat untuk memenuhi tugas pembuatan sistem **CRUD Owner (Menu & Kategori)**, serta dikembangkan lebih lanjut dengan fitur tambahan agar alur sistem restoran menjadi lebih realistis dan terintegrasi.

> **Catatan:**  
> Fitur utama yang menjadi fokus penilaian adalah **CRUD Menu dan Kategori oleh Owner/Admin**.  
> Fitur lain merupakan **pengembangan tambahan (optional)**.

---

## 🧩 Gambaran Umum Sistem

### 1️⃣ Pelanggan (Guest)
- Pelanggan datang ke restoran dan **langsung memilih meja**
- Setiap meja sudah tersedia **tablet**
- Meja **sudah terdaftar di database**
- Guest melakukan:
  - Self ordering (memilih menu)
  - Konfirmasi pesanan
- Guest **tidak perlu login**

---

### 2️⃣ Sistem Login (Internal Staff)
- Tidak tersedia tombol login di tablet guest
- Login hanya bisa diakses melalui URL khusus, contoh:

###http://localhost:8100/login

- Login digunakan oleh:
- Chef
- Kasir
- Owner/Admin

---

### 3️⃣ Chef
Chef memiliki 2 tanggung jawab utama:

#### 🔹 A. Setup Stok Harian
- Dilakukan setiap pagi
- Menentukan stok per menu
- Contoh:
- Nasi Goreng → 50 porsi
- Mie Ayam → 40 porsi

#### 🔹 B. Memproses Pesanan
- Melihat pesanan masuk dari guest
- Memasak menu yang dipesan
- Menekan tombol **“Selesai Dimasak”** setelah menu selesai dibuat

---

### 4️⃣ Kasir
- Menerima notifikasi ketika:
- Menu sudah selesai dimasak oleh chef
- Melakukan proses lanjutan (pembayaran / penyajian)

---

### 5️⃣ Owner / Admin (**Fitur Utama Tugas**)
Owner/Admin memiliki hak penuh untuk:

#### ✅ CRUD Menu
- Tambah menu
- Edit menu
- Hapus menu
- Lihat daftar menu

#### ✅ CRUD Kategori Menu
- Contoh kategori:
- Makanan Berat
- Makanan Ringan
- Minuman

> **Bagian ini merupakan fokus utama sesuai instruksi tugas.**

---

## 🧠 Alur Sistem Singkat
1. Guest memilih meja
2. Guest memesan makanan melalui tablet
3. Pesanan masuk ke:
 - Dashboard Chef
 - Dashboard Kasir
4. Chef memasak dan menandai pesanan selesai
5. Kasir memproses pesanan

---

## 🗂️ Role & Hak Akses

| Role        | Hak Akses |
|------------|----------|
| Guest      | Pilih meja, pesan makanan |
| Chef       | Setup stok harian, proses pesanan |
| Kasir      | Melihat pesanan siap, proses lanjutan |
| Owner/Admin| CRUD Menu & Kategori |

---

## 🛠️ Teknologi yang Digunakan
> *(Silakan sesuaikan)*

- Frontend : Ionic / Vue / lainnya
- Backend  : PHP / Laravel / lainnya
- Database : MySQL
- Tools    : Git, GitHub

---

## 📎 Catatan Tambahan
- Sistem ini dikembangkan dengan pendekatan **role-based**
- Fitur di luar CRUD Owner dibuat sebagai **pengembangan sistem**
- Jika diperlukan untuk penilaian, fitur tambahan dapat diabaikan

---

## 👨‍💻 Author
**Nama:** _(Isi nama kamu)_  
**Project:** Tugas Sistem Informasi Restoran  
**Tahun:** 2026