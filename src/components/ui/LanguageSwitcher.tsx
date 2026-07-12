"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  if (!mounted) return null;

  // Sembunyikan tombol ganti bahasa untuk sementara di semua perangkat sesuai permintaan
  return null;

  return (
    <>
      {/* 1. KHUSUS LAPTOP/DESKTOP (>= 768px): Di atas kanan lengkap dengan teks */}
      <div className="fixed top-3 left-0 right-0 z-50 pointer-events-none h-[64px] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-end">
          <button
            onClick={toggleLanguage}
            className="pointer-events-auto relative z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 py-3 rounded-[2rem] hover:scale-105 active:scale-95 transition-all"
            title={`Language: ${language.toUpperCase()}`}
          >
            <Globe className="w-[18px] h-[18px] text-[#196EEE]" />
            <span className="text-sm font-semibold text-[#196EEE] uppercase">
              {language}
            </span>
          </button>
        </div>
      </div>

      {/* 2. KHUSUS MOBILE (< 768px): Di kanan bawah di atas navbar, menampilkan teks EN / ID */}
      <div className="fixed bottom-24 right-5 z-50 md:hidden">
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center w-11 h-11 bg-white/95 backdrop-blur-md border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.14)] rounded-full hover:scale-105 active:scale-95 transition-all"
          aria-label="Ganti Bahasa"
          title="Ganti Bahasa"
        >
          <span className="text-xs font-bold text-[#196EEE] uppercase tracking-wider">
            {language}
          </span>
        </button>
      </div>
    </>
  );
}
