# ISYARA: Platform Belajar Bahasa Isyarat Interaktif

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-auth-green?logo=supabase)](https://supabase.io/)

ISYARA adalah aplikasi web interaktif yang dirancang untuk membantu pengguna mempelajari Bahasa Isyarat Indonesia (BISINDO) melalui teknologi pengenalan gerakan tangan secara *real-time*. Proyek ini menggunakan React, Vite, dan Tailwind CSS v4 untuk frontend, serta mengintegrasikan MediaPipe dan TensorFlow.js untuk fitur intinya.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Panduan Instalasi & Konfigurasi Lokal](#panduan-instalasi--konfigurasi-lokal)
- [Detail Implementasi](#detail-implementasi)
  - [Alur Otentikasi](#alur-otentikasi)
  - [Pengenalan Gerakan Tangan](#pengenalan-gerakan-tangan)
- [Skrip yang Tersedia](#skrip-yang-tersedia)

## Fitur Utama

-   ✍️ **Pembelajaran Modul Terstruktur**: Materi belajar dibagi menjadi beberapa modul yang mudah diikuti (misalnya, Alfabet, Kata Sapaan).
-   📹 **Latihan Praktik Real-time**: Pengguna dapat berlatih gerakan isyarat langsung menggunakan kamera web dan mendapatkan umpan balik instan.
-   🎮 **Tantangan Susun Kata**: Gamifikasi untuk menguji pemahaman dengan menyusun kata dari gerakan isyarat yang terdeteksi.
-   🏆 **Papan Peringkat (Leaderboard)**: Sistem papan skor untuk memotivasi pengguna dengan menampilkan peringkat berdasarkan poin yang diperoleh.
-   🔐 **Otentikasi Pengguna**: Sistem login dan registrasi yang aman menggunakan email/password dan Google OAuth melalui Supabase.
-   👤 **Profil Pengguna**: Halaman di mana pengguna dapat melihat progres, skor, dan memperbarui informasi pribadi mereka.
-   📱 **Desain Responsif**: Antarmuka yang dioptimalkan untuk pengalaman pengguna yang mulus di perangkat desktop maupun mobile.

## Tumpukan Teknologi

-   **Frontend**: React 19, Vite
-   **Styling**: Tailwind CSS v4 dengan variabel `@theme` kustom
-   **Routing**: React Router v7
-   **State Management**: React Context API (`AuthContext`, `LearningContext`)
-   **Otentikasi**: Supabase (untuk OAuth & manajemen pengguna)
-   **Pengenalan Gerakan Tangan**:
    -   **MediaPipe Hands**: Untuk deteksi kerangka tangan (*hand landmark*)
    -   **TensorFlow.js**: Untuk menjalankan model klasifikasi gerakan kustom (`model.json`)
-   **Linting**: ESLint
-   **Deployment Pratinjau**: Dikonfigurasi untuk Railway (berdasarkan URL API)

## Struktur Proyek

Proyek ini mengadopsi struktur berbasis fitur (*feature-based*) yang dikombinasikan dengan arsitektur Presenter-View untuk memisahkan logika dan tampilan.
```bash
isyara-frontend/
├── @docs/                     # Dokumentasi internal proyek
│   ├── google-auth.md         # Panduan integrasi Google Auth
│   └── tailwind-v4-guide.md   # Panduan setup Tailwind CSS v4
├── public/
│   └── Model/                 # Model TensorFlow.js untuk klasifikasi
│       └── model.json         #
├── src/
│   ├── assets/                # Aset statis seperti gambar dan logo
│   ├── common/                # Komponen dan layout yang dapat digunakan kembali
│   │   ├── components/
│   │   │   ├── layout/        # (Sidebar, AuthLayout)
│   │   │   ├── modules/       # (ModuleItem)
│   │   │   ├── shared/        # (ErrorBoundary, SuccessOverlay)
│   │   │   └── ui/            # (Button, Input, Logo)
│   ├── contexts/              # Penyedia Konteks React (AuthProvider, LearningProvider)
│   ├── features/              # Fitur-fitur utama aplikasi
│   │   ├── auth/              # Otentikasi (login, register, callback)
│   │   ├── belajar/           # Fitur belajar (modul, submodule, praktik)
│   │   ├── dashboard/         # Halaman dashboard
│   │   ├── gesture/           # Logika & komponen deteksi gerakan
│   │   ├── peringkat/         # Fitur papan peringkat
│   │   ├── profile/           # Halaman profil pengguna
│   │   └── tantangan/         # Fitur tantangan susun kata
│   ├── services/              # Layanan untuk logika bisnis dan API
│   │   ├── api/               # Klien API terpusat (apiClient.js)
│   │   ├── auth/              # Logika otentikasi (authService.js)
│   │   └── gesture/           # Logika deteksi gerakan
│   ├── App.jsx                # Komponen utama aplikasi dengan routing
│   ├── index.css              # File CSS global dengan konfigurasi @theme Tailwind
│   └── main.jsx               # Titik masuk aplikasi React
├── .env.example               # Contoh file environment
├── .gitignore                 # File dan folder yang diabaikan Git
├── index.html                 # Template HTML utama
├── package.json               # Dependensi dan skrip proyek
└── vite.config.js             # Konfigurasi Vite

## Prasyarat

-   Node.js (versi 18.x atau lebih tinggi)
-   npm (atau yarn/pnpm)

## Panduan Instalasi & Konfigurasi Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username/isyara-frontend.git](https://github.com/username/isyara-frontend.git)
    cd isyara-frontend
    ```

2.  **Instal Dependensi**
    Jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan.
    ```bash
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan**
    Buat file bernama `.env` di direktori *root* proyek dengan menyalin dari `.env.example` (jika ada) atau membuatnya dari awal. Isi file tersebut dengan kredensial Anda.

    ```env
    # URL proyek Supabase Anda
    VITE_SUPABASE_URL="[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)"

    # Kunci "anon" publik Supabase Anda
    VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

    # URL backend API ISYARA (lokal atau production)
    VITE_API_URL="http://localhost:3000/api"
    ```

    -   `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Diperoleh dari dashboard proyek Supabase Anda di bawah **Settings -> API**.
    -   `VITE_API_URL`: Arahkan ke *endpoint* backend ISYARA Anda. Untuk pengembangan, ini mungkin `http://localhost:3000/api`.

4.  **Konfigurasi Supabase & Google Cloud**
    Untuk fungsionalitas penuh, terutama Google OAuth, Anda perlu mengonfigurasi Supabase dan Google Cloud Console seperti yang dijelaskan dalam dokumen [**google-auth.md**](@docs/google-auth.md).

5.  **Jalankan Server Pengembangan**
    Setelah konfigurasi selesai, jalankan aplikasi.
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173` (atau port lain jika 5173 sedang digunakan).

## Detail Implementasi

### Alur Otentikasi

Otentikasi ditangani melalui kombinasi Supabase untuk OAuth dan interaksi dengan backend kustom untuk data pengguna aplikasi.

1.  **Inisiasi**: Pengguna mengklik tombol "Login with Google".
2.  **Redirect**: `AuthContext` memanggil `supabase.auth.signInWithOAuth`, yang mengarahkan pengguna ke halaman persetujuan Google.
3.  **Callback**: Setelah berhasil, Google mengarahkan kembali ke `/auth/callback` di aplikasi.
4.  **Manajemen Sesi**: Komponen `AuthCallback` dan `AuthContext` menangani sesi yang dibuat oleh Supabase.
5.  **Sinkronisasi Backend**: Data pengguna dari Google (seperti ID, email, nama, dan URL avatar) dikirim ke backend ISYARA melalui *endpoint* `/api/auth/save-user` untuk disimpan di database aplikasi. Ini memungkinkan data seperti skor dan progres pembelajaran untuk diasosiasikan dengan pengguna.

### Pengenalan Gerakan Tangan

Fitur ini adalah inti dari aplikasi dan diimplementasikan dalam dua tahap:

1.  **Deteksi Kerangka Tangan**:
    -   Menggunakan **MediaPipe Hands** yang dimuat melalui CDN di `index.html`.
    -   Komponen `HandGestureDetector` menginisialisasi kamera dan menggunakan MediaPipe untuk mendeteksi 21 titik *landmark* pada tangan pengguna secara *real-time*.

2.  **Klasifikasi Gerakan**:
    -   *Landmark* yang terdeteksi kemudian dinormalisasi dan diolah menjadi tensor.
    -   Tensor ini diumpankan ke model **TensorFlow.js** (`public/Model/model.json`) yang telah dilatih sebelumnya untuk mengklasifikasikan gerakan tangan ke dalam salah satu dari 26 huruf alfabet (A-Z).
    -   Logika ini, termasuk pemrosesan *landmark* dan prediksi, terdapat dalam komponen `HandGestureDetector`.

## Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan skrip berikut:

-   `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
-   `npm run build`: Membangun aplikasi untuk produksi di dalam folder `dist`.
-   `npm run lint`: Menjalankan ESLint untuk memeriksa masalah gaya penulisan kode.
-   `npm run preview`: Menjalankan server lokal untuk meninjau hasil *build* produksi.

---

Dengan mengikuti panduan ini, Anda seharusnya dapat mereplikasi dan menjalankan proyek ISYARA di lingkungan lokal Anda. Selamat mencoba!
