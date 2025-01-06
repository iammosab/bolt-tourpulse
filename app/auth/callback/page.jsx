'use client'
    import { useEffect } from 'react'
    import { useRouter } from 'next/navigation'
    import { supabase } from '@/lib/supabaseClient'

    export default function CallbackPage() {
      const router = useRouter()

      useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN') {
            router.push('/dashboard')
          }
        })

        return () => subscription.unsubscribe()
      }, [router])

      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Redirecting...</p>
        </div>
      )
    }
