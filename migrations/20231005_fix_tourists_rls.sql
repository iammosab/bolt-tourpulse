-- Drop existing policies on tourists table
    DROP POLICY IF EXISTS "Guides can manage tourists in their tours" ON tourists;
    DROP POLICY IF EXISTS "Tourists can view their own records" ON tourists;

    -- Recreate policies with proper conditions
    CREATE POLICY "Guides can manage tourists in their tours" ON tourists
      FOR ALL USING (
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

    -- Add policy for tourists to join tours
    CREATE POLICY "Tourists can join tours" ON tourists
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM tours
          WHERE tours.id = tourists.tour_id
            AND tours.status = 'planned'
        )
      );
