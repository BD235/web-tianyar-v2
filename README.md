# 🌴 Wisata Tianyar (Versi 2)

Platform sistem informasi destinasi wisata Desa Tianyar, Bali. Dibangun dengan fokus pada performa yang ringan, antarmuka modern, dan pengalaman pengguna yang cepat.

## 🛠️ Teknologi Utama
- **Framework**: Next.js 15+ (App Router)
- **UI & Styling**: Tailwind CSS v4, Lucide React
- **Database**: Supabase (PostgreSQL)
- **Bahasa**: TypeScript

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Pastikan `pnpm` sudah terinstal**
   Proyek ini menggunakan `pnpm`. Jika belum punya, install dengan:
   ```bash
   npm install -g pnpm
   ```

2. **Instalasi Dependensi**
   Buka terminal di dalam folder proyek ini, lalu jalankan:
   ```bash
   pnpm install
   ```

3. **Atur Environment Variables (Database)**
   Buat file bernama `.env.local` di *root folder* (sejajar dengan file `package.json`). Isi dengan kunci Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[ID-PROJECT].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...[KUNCI-ANDA]
   ```

4. **Jalankan Server Lokal**
   ```bash
   pnpm dev
   ```
   Buka browser dan akses [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---
*Proyek ini merupakan bagian dari pengabdian KKN.*
