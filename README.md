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
