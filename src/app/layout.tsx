import type { Metadata } from "next";
import { Montserrat, Kaushan_Script } from "next/font/google";
import "./globals.css";

// Setup font Montserrat untuk teks utama (judul, subjudul, teks)
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Setup font Kaushan Script untuk logo
const kaushan = Kaushan_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kaushan",
});

export const metadata: Metadata = {
  title: "Wisata Tianyar",
  description: "Platform informasi destinasi wisata di Desa Tianyar, Bali",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} ${kaushan.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
