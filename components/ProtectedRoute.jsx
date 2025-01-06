'use client'
    import { useAuth } from '@/context/AuthContext'
    import { useRouter } from 'next/navigation'
    import { useEffect } from 'react'

    export default function ProtectedRoute({ children }) {
      const { user, loading } = useAuth()
      const router = useRouter()

      useEffect(() => {
        if (!loading && !user) {
          router.push('/auth/login')
        }
      }, [user, loading, router])

      if (loading || !user) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )
      }

      return children
    }
