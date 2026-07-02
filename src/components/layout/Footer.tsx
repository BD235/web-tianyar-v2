import { Camera, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-12 mt-auto bg-white flex flex-col items-center justify-center gap-6 border-t border-slate-100">

            {/* Kumpulan Ikon Kontak/Sosmed */}
            <div className="flex items-center gap-4">
                <Link
                    href="#"
                    className="w-12 h-12 flex items-center justify-center bg-slate-200 rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="Social Media 1"
                >
                    <Camera className="w-5 h-5" />
                </Link>

                <Link
                    href="#"
                    className="w-12 h-12 flex items-center justify-center bg-slate-200 rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                </Link>

                <Link
                    href="#"
                    className="w-12 h-12 flex items-center justify-center bg-slate-200 rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="Email"
                >
                    <Mail className="w-5 h-5" />
                </Link>
            </div>

            {/* Teks Copyright */}
            <p className="text-[13px] text-slate-800 font-medium">
                ©2026 WisataTianyar. All rights reserved.
            </p>

        </footer>
    );
}
