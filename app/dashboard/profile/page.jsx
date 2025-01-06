'use client'
    import { useState, useEffect } from 'react'
    import { useAuth } from '@/context/AuthContext'
    import { supabase } from '@/lib/supabaseClient'

    export default function ProfilePage() {
      const { user } = useAuth()
      const [profile, setProfile] = useState(null)
      const [loading, setLoading] = useState(true)

      useEffect(() => {
        const fetchProfile = async () => {
          if (user) {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single()

            if (error) throw error
            setProfile(data)
            setLoading(false)
          }
        }

        fetchProfile()
      }, [user])

      if (loading) {
        return <div>Loading profile...</div>
      }

      return (
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {profile?.full_name || 'User Profile'}
            </h2>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>
        </div>
      )
    }
