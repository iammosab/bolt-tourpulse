'use client'
    import { createContext, useContext, useEffect, useState } from 'react'
    import { supabase } from '@/lib/supabaseClient'
    import { useRouter } from 'next/navigation'

    const AuthContext = createContext()

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null)
      const [loading, setLoading] = useState(true)
      const router = useRouter()

      useEffect(() => {
        const getSession = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
          } catch (error) {
            console.error('Error getting session:', error)
          } finally {
            setLoading(false)
          }
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        })

        return () => subscription.unsubscribe()
      }, [])

      const value = {
        user,
        loading,
        signOut: async () => {
          await supabase.auth.signOut()
          router.push('/auth/login')
        }
      }

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      )
    }

    export const useAuth = () => {
      const context = useContext(AuthContext)
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
      }
      return context
    }
