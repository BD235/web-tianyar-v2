import DesktopNavbar from '@/components/layout/DesktopNavbar'
import TopLogo from '@/components/layout/TopLogo'
import { createClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'

export default async function AdminFormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdminAuth = true

  return (
    <div className="flex flex-col min-h-screen relative pt-0 md:pt-28">
      <TopLogo />
      <DesktopNavbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
