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

  return (
    <div className="fixed top-3 left-0 right-0 z-50 pointer-events-none h-[64px]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full h-full flex items-center justify-end">
        <button
          onClick={toggleLanguage}
          className="pointer-events-auto relative z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-3 py-2 md:px-4 md:py-3.5 rounded-[2rem] hover:scale-105 active:scale-95 transition-all"
        >
          <Globe className="w-[18px] h-[18px] text-[#196EEE]" />
          <span className="text-xs md:text-sm font-semibold text-[#196EEE] uppercase">
            {language}
          </span>
        </button>
      </div>
    </div>
  );
}
