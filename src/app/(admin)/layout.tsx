export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Nanti Sidebar Admin akan ditaruh di sini */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
