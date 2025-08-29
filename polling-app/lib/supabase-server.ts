import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerComponentClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export function createMiddlewareClient(request: Request) {
  let response = new Response()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('cookie')
          if (!cookieHeader) return []
          
          return cookieHeader.split(';').map(cookie => {
            const [name, value] = cookie.trim().split('=')
            return { name, value }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.headers.set(name, value))
          response = new Response(null, {
            status: 302,
            headers: request.headers,
          })
        },
      },
    }
  )

  return { supabase, response }
}
