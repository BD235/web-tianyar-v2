import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/src/types'

// Klien Supabase untuk digunakan di dalam Komponen Klien (Client Components)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
