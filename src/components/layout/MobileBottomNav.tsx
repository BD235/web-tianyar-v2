"use client";

import { Home, MapPin, Map, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdminAuth(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuth(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { href: "/home", icon: Home, label: t("home") },
    { href: "/destinasi", icon: MapPin, label: t("destinations") },
    { href: "/peta", icon: Map, label: t("maps") },
  ];

  // Tambah menu admin
  if (isAdminAuth) {
    navItems.push({ href: "/admin", icon: Shield, label: t("admin") });
  }

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4 md:hidden">
      <nav className="flex items-center justify-evenly w-full max-w-[380px] h-14 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 rounded-[24px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "p-3 rounded-[16px] flex items-center justify-center transition-all duration-300",
                isActive
                  ? "text-[#196EEE]"
                  : "text-slate-400 hover:text-[#196EEE]"
              )}
              aria-label={item.label}
            >
              <Icon className={cn("w-[20px] h-[20px]", isActive ? "stroke-[2.5]" : "stroke-[2]")} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
