import Link from "next/link";

// SVG icon Instagram
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// SVG icon Facebook
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

// SVG icon Email
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full pt-6 mob-m:pt-7 mob-l:pt-8 pb-24 sm:py-12 mt-auto bg-white flex flex-col items-center justify-center gap-4 mob-m:gap-5 mob-l:gap-6 border-t border-slate-100">

      <div className="flex items-center gap-3 mob-m:gap-4">
        {/* Instagram */}
        <Link
          href="https://www.instagram.com/tianyarbersehati?igsh=ZjJtcnpzYzEwdTA4"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-pink-100 hover:text-pink-600 transition-all"
          aria-label="Instagram Tianyar Bersehati"
        >
          <InstagramIcon className="w-[18px] h-[18px] mob-l:w-5 mob-l:h-5" />
        </Link>

        {/* Facebook */}
        <Link
          href="https://www.facebook.com/share/1D8DQPwcBf/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all"
          aria-label="Facebook Desa Tianyar"
        >
          <FacebookIcon className="w-[18px] h-[18px] mob-l:w-5 mob-l:h-5" />
        </Link>

        {/* Email */}
        <Link
          href="mailto:desatianyar2@gmail.com"
          className="w-10 h-10 mob-m:w-11 mob-m:h-11 mob-l:w-12 mob-l:h-12 flex items-center justify-center bg-slate-200 rounded-xl mob-l:rounded-2xl text-slate-500 hover:bg-green-100 hover:text-green-600 transition-all"
          aria-label="Email Desa Tianyar"
        >
          <MailIcon className="w-[18px] h-[18px] mob-l:w-5 mob-l:h-5" />
        </Link>
      </div>

      <p className="text-xs mob-m:text-[13px] sm:text-sm text-slate-800 font-medium text-center px-4">
        ©2026 WisataTianyar. All rights reserved.
      </p>

    </footer>
  );
}
