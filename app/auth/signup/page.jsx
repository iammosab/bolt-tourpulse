'use client'
    import { useState, useEffect } from 'react'
    import { useRouter } from 'next/navigation'
    import { supabase } from '@/lib/supabaseClient'

    export default function SignupPage() {
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [fullName, setFullName] = useState('')
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
      const [retryAfter, setRetryAfter] = useState(null)
      const router = useRouter()

      useEffect(() => {
        // Clear any existing errors on mount
        setError('')
        setRetryAfter(null)
      }, [])

      const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
          // Create auth user
          const { data: { user }, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
              data: {
                full_name: fullName
              }
            }
          })

          if (authError) {
            if (authError.message.includes('For security purposes')) {
              const seconds = parseInt(authError.message.match(/\d+/)[0])
              setRetryAfter(seconds)
              throw new Error(`Please wait ${seconds} seconds before trying again`)
            }
            throw authError
          }

          // Create profile
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: user.id,
              fullName
            })
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || 'Failed to create profile')
          }

          router.push('/auth/verify')
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }

      return (
        <div className="max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                minLength={6}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
                {retryAfter && (
                  <div className="mt-2">
                    <p>Please wait {retryAfter} seconds before trying again.</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(retryAfter / 21) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || retryAfter}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      )
    }
