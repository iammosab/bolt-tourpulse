import { supabase } from '@/lib/supabaseClient'
    import { NextResponse } from 'next/server'

    export async function POST(request) {
      const { userId, fullName } = await request.json()

      try {
        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        // If user doesn't exist, create profile
        if (!existingUser) {
          const { data, error } = await supabase
            .from('users')
            .upsert({
              id: userId,
              full_name: fullName,
              role: 'tourist'
            })
            .select()

          if (error) throw error

          return NextResponse.json(data[0], { status: 200 })
        }

        return NextResponse.json(existingUser, { status: 200 })
      } catch (error) {
        console.error('Profile creation error:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
    }
