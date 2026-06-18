import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sementara biarkan lolos (pass-through)
  // Nanti akan kita isi dengan logika pengecekan login Supabase (Auth Guard)
  return NextResponse.next()
}

export const config = {
  // Middleware akan dijalankan di semua rute KECUALI file statis dan gambar
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
