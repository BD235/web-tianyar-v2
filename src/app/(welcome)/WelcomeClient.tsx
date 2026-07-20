"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeClientProps {
  desktopImage: string;
  mobileImage: string;
}

export default function WelcomeClient({ desktopImage, mobileImage }: WelcomeClientProps) {
  const { t } = useLanguage();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Desktop - Rendered dengan next/image + unoptimized agar langsung dari CDN Supabase tanpa error optimizer / black screen */}
      <div className="hidden md:block absolute inset-0 select-none pointer-events-none">
        <Image
          src={desktopImage}
          alt="Tianyar Background Desktop"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Background Mobile - Rendered dengan next/image + unoptimized agar langsung dari CDN Supabase tanpa error optimizer / black screen */}
      <div className="md:hidden absolute inset-0 select-none pointer-events-none">
        <Image
          src={mobileImage}
          alt="Tianyar Background Mobile"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 md:from-black/5 md:via-transparent md:to-black/55" />

      {/* Layout Mobile */}
      <div className="md:hidden absolute inset-0 flex flex-col justify-between px-7 pb-12 pt-14">
        <div>
          <h1
            className="text-white text-6xl leading-tight drop-shadow-md"
            style={{ fontFamily: "var(--font-kaushan), cursive" }}
          >
            Tianyar
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-white/90 text-base font-light tracking-wide mb-0.5 drop-shadow">
              {t("discover")}
            </p>
            <h2 className="text-white text-xl font-semibold leading-snug drop-shadow-lg">
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

      {/* Layout Desktop */}
      <div className="hidden md:flex absolute inset-0 flex-col justify-between px-16 pb-16 pt-12">
        <div className="flex justify-center">
          <h1
            className="text-white drop-shadow-md"
            style={{
              fontFamily: "var(--font-kaushan), cursive",
              fontSize: "clamp(3.5rem, 7vw, 6rem)",
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
  );
}
