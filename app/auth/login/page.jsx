'use client'
    import { useState } from 'react'
    import { useRouter } from 'next/navigation'
    import { supabase } from '@/lib/supabaseClient'

    export default function LoginPage() {
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState('')
      const router = useRouter()

      const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) throw error
          router.push('/dashboard')
        } catch (error) {
          setError(error.message)
        } finally {
          setLoading(false)
        }
      }

      return (
        <div className="max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
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
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      )
    }
