import { Camera, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full pt-6 mob-m:pt-7 mob-l:pt-8 pb-24 sm:py-12 mt-auto bg-white flex flex-col items-center justify-center gap-4 mob-m:gap-5 mob-l:gap-6 border-t border-slate-100">

            <div className="flex items-center gap-3 mob-m:gap-4">
                <Link
                    href="#"
                    className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="Social Media 1"
                >
                    <Camera className="w-4 h-4 mob-l:w-5 mob-l:h-5" />
                </Link>

                <Link
                    href="#"
                    className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="WhatsApp"
                >
                    <MessageCircle className="w-4 h-4 mob-l:w-5 mob-l:h-5" />
                </Link>

                <Link
                    href="#"
                    className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-all"
                    aria-label="Email"
                >
                    <Mail className="w-4 h-4 mob-l:w-5 mob-l:h-5" />
                </Link>
            </div>

            <p className="text-xs mob-m:text-[13px] sm:text-sm text-slate-800 font-medium text-center px-4">
                ©2026 WisataTianyar. All rights reserved.
            </p>

        </footer>
    );
}
