import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopNavbar from "@/components/layout/DesktopNavbar";
import Footer from "@/components/layout/Footer";
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import TopLogo from '@/components/layout/TopLogo';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdminAuth = !!user;

  return (
    <div className="flex flex-col min-h-screen relative pb-24 md:pb-0 pt-0 md:pt-28">
      {/* Logo Kiri Atas */}
      <TopLogo />

      {/* Navbar Desktop (Tampil hanya di layar MD ke atas) */}
      <DesktopNavbar isAdminAuth={isAdminAuth} />

      <div className="flex-1">
        {children}
      </div>

      {/* Footer Publik (Merespons Desktop & Mobile) */}
      <Footer />

      {/* Navigasi Bawah khusus Mobile */}
      <MobileBottomNav isAdminAuth={isAdminAuth} />
    </div>
  );
}
