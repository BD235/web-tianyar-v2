import MobileBottomNav from "@/components/layout/MobileBottomNav";
import DesktopNavbar from "@/components/layout/DesktopNavbar";
import Footer from "@/components/layout/Footer";
import Link from 'next/link';
import TopLogo from '@/components/layout/TopLogo';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative pt-0 md:pt-28">

      <TopLogo />

      <DesktopNavbar />

      <div className="flex-1">
        {children}
      </div>

      <Footer />

      <MobileBottomNav />
    </div>
  );
}

