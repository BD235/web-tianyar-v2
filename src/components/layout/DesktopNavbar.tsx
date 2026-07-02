"use client";

import { Map, MapPin, Home, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface DesktopNavbarProps {
    isAdminAuth?: boolean;
}

export default function DesktopNavbar({ isAdminAuth = false }: DesktopNavbarProps) {
    const pathname = usePathname();
    const { t } = useLanguage();

    const navItems = [
        { href: "/home", icon: Home, label: t("home") },
        { href: "/destinasi", icon: MapPin, label: t("destinations") },
        { href: "/peta", icon: Map, label: t("maps") },
    ];

    if (isAdminAuth) {
        navItems.push({ href: "/admin", icon: Shield, label: t("admin") });
    }

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
            <nav className="bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] px-6 py-3.5 sm:px-12 sm:py-4 flex items-center justify-between gap-5 sm:gap-10 border border-black/5">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/home" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 font-semibold transition-colors duration-200 text-sm",
                                isActive
                                    ? "text-[#196EEE]"
                                    : "text-gray-400 hover:text-[#196EEE]"
                            )}
                        >
                            <Icon className="w-[20px] h-[20px]" strokeWidth={2.5} />
                            <span className="hidden sm:inline">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
