-- Drop existing policies on tourists table
    DROP POLICY IF EXISTS "Guides can manage tourists in their tours" ON tourists;
    DROP POLICY IF EXISTS "Tourists can view their own records" ON tourists;
    DROP POLICY IF EXISTS "Tourists can join tours" ON tourists;

    -- Recreate policies with stricter conditions
    CREATE POLICY "Guides can manage tourists in their tours" ON tourists
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM tours
          WHERE tours.id = tourists.tour_id
            AND tours.guide_id = auth.uid()
        )
      ) WITH CHECK (
        EXISTS (
          SELECT 1 FROM tours
          WHERE tours.id = tourists.tour_id
            AND tours.guide_id = auth.uid()
        )
      );

    CREATE POLICY "Tourists can view their own records" ON tourists
      FOR SELECT USING (
        auth.uid() = id
      );

    CREATE POLICY "Tourists can join tours" ON tourists
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM tours
          WHERE tours.id = tourists.tour_id
            AND tours.status = 'planned'
        )
        AND auth.uid() = id
      );

    -- Update users table policy to be more specific
    DROP POLICY IF EXISTS "Guides can view tourist profiles in their tours" ON users;

    CREATE POLICY "Guides can view tourist profiles in their tours" ON users
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM tourists
          JOIN tours ON tours.id = tourists.tour_id
          WHERE tourists.id = users.id
            AND tours.guide_id = auth.uid()
        )
        AND role = 'tourist'
      );
