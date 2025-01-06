-- Enable RLS for users table if not already enabled
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow profile creation during signup" ON users;
    DROP POLICY IF EXISTS "Users can view their own profile" ON users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON users;
    DROP POLICY IF EXISTS "Guides can view tourist profiles in their tours" ON users;

    -- Recreate policies with updated definitions
    CREATE POLICY "Allow profile creation during signup" ON users
      FOR INSERT WITH CHECK (
        auth.uid() = id
      );

    CREATE POLICY "Users can view their own profile" ON users
      FOR SELECT USING (
        auth.uid() = id
      );

    CREATE POLICY "Users can update their own profile" ON users
      FOR UPDATE USING (
        auth.uid() = id
      );

    CREATE POLICY "Guides can view tourist profiles in their tours" ON users
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM tourists
          JOIN tours ON tours.id = tourists.tour_id
          WHERE tourists.id = users.id
            AND tours.guide_id = auth.uid()
        )
      );
