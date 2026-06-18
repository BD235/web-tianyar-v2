import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Fungsi sederhana untuk membaca file .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ File .env.local tidak ditemukan!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    // Abaikan komentar dan baris kosong
    if (!line || line.startsWith('#')) return;
    
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      env[key.trim()] = values.join('=').trim();
    }
  });
  
  return env;
}

async function testSupabaseConnection() {
  const env = loadEnv();
  const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL'];
  const SUPABASE_KEY = env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] || env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL atau Key tidak ditemukan di .env.local');
    process.exit(1);
  }

  // Inisialisasi Supabase menggunakan library standard (bukan SSR karena ini cuma script Node)
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log('⏳ Sedang mencoba menghubungi database Supabase...');

  try {
    // Mencoba mengambil data dari tabel 'categories'
    // Menggunakan limit(1) agar prosesnya ringan dan cepat
    const { data, error, status } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Gagal terhubung ke database. Detail error:');
      console.error(error);
    } else {
      console.log('✅ BERHASIL TERHUBUNG KE SUPABASE!');
      console.log('Status HTTP:', status);
      
      if (data.length === 0) {
        console.log('⚠️ Terhubung, tapi tabel "categories" masih KOSONG.');
      } else {
        console.log('📦 Data sample dari "categories":', data);
      }
    }
  } catch (err) {
    console.error('❌ Terjadi kesalahan tak terduga:', err.message);
  }
}

testSupabaseConnection();
