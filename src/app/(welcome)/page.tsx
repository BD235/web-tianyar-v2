"use client";
const DESKTOP_IMAGE = 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1920&q=80'
const MOBILE_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'

import Link from 'next/link'
import { useLanguage } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const { t } = useLanguage();
  return (
    <main className="relative w-full h-screen overflow-hidden">

      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${DESKTOP_IMAGE}')` }}
      />
      <div
        className="md:hidden absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${MOBILE_IMAGE}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 md:from-black/5 md:via-transparent md:to-black/55" />

      <div className="md:hidden absolute inset-0 flex flex-col justify-between px-7 pb-12 pt-14">
        <div>
          <h1
            className="text-white text-6xl leading-tight"
            style={{ fontFamily: 'var(--font-kaushan), cursive' }}
          >
            Tianyar
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-white/90 text-base font-light tracking-wide mb-0.5">
              {t("discover")}
            </p>
            <h2 className="text-white text-xl font-semibold leading-snug">
              {t("beauty")}
            </h2>
          </div>

          <Link href="/home">
            <button className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-semibold text-base py-4 rounded-[20px] shadow-lg shadow-blue-900/30">
              {t("explore")}
            </button>
          </Link>
        </div>
      </div>

      <div className="hidden md:flex absolute inset-0 flex-col justify-between px-16 pb-16 pt-12">
        <div className="flex justify-center">
          <h1
            className="text-white drop-shadow-md"
            style={{
              fontFamily: 'var(--font-kaushan), cursive',
              fontSize: 'clamp(3.5rem, 7vw, 6rem)',
              lineHeight: 1.1,
            }}
          >
            Tianyar
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <p className="text-white/85 text-base font-light tracking-widest uppercase mb-1 drop-shadow">
              {t("discover")}
            </p>
            <h2 className="text-white text-xl lg:text-2xl font-semibold tracking-wide uppercase drop-shadow-lg">
              {t("beauty")}
            </h2>
          </div>

          <Link href="/home">
            <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-semibold text-base px-20 py-4 rounded-[20px] shadow-lg shadow-blue-900/30 min-w-[240px]">
              {t("explore")}
            </button>
          </Link>
        </div>
      </div>

    </main>
  )
}
