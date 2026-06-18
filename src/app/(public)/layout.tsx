export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nanti Navbar Publik akan ditaruh di sini */}
      <div className="flex-1">
        {children}
      </div>
      {/* Nanti Footer Publik akan ditaruh di sini */}
    </div>
  );
}
