import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
    taint: true,
  },
  images: {
    // Izinkan next/image mengoptimasi gambar dari Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'esurvszclaudbtvxiytf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Aktifkan format modern: AVIF lebih kecil dari WebP, WebP lebih kecil dari JPEG
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
