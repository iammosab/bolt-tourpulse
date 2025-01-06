-- Users table policies
    CREATE POLICY "Users can view their own profile" ON users
      FOR SELECT USING (auth.uid() = id);

    CREATE POLICY "Users can update their own profile" ON users
      FOR UPDATE USING (auth.uid() = id);

    -- Tours table policies
    CREATE POLICY "Guides can manage their tours" ON tours
      FOR ALL USING (auth.uid() = guide_id);

    CREATE POLICY "Tourists can view tours they're part of" ON tours
      FOR SELECT USING (EXISTS (
        SELECT 1 FROM tourists
        WHERE tourists.tour_id = tours.id
          AND tourists.id = auth.uid()
      ));

    -- Tourists table policies
    CREATE POLICY "Guides can manage tourists in their tours" ON tourists
      FOR ALL USING (EXISTS (
        SELECT 1 FROM tours
        WHERE tours.id = tourists.tour_id
          AND tours.guide_id = auth.uid()
      ));

    CREATE POLICY "Tourists can view their own records" ON tourists
      FOR SELECT USING (auth.uid() = id);

    -- Excursions table policies
    CREATE POLICY "Guides can manage excursions in their tours" ON excursions
      FOR ALL USING (EXISTS (
        SELECT 1 FROM tours
        WHERE tours.id = excursions.tour_id
          AND tours.guide_id = auth.uid()
      ));

    CREATE POLICY "Tourists can view excursions in their tours" ON excursions
      FOR SELECT USING (EXISTS (
        SELECT 1 FROM tourists
        WHERE tourists.tour_id = excursions.tour_id
          AND tourists.id = auth.uid()
      ));

    -- Attendance table policies
    CREATE POLICY "Guides can manage attendance in their tours" ON attendance
      FOR ALL USING (EXISTS (
        SELECT 1 FROM excursions
        JOIN tours ON tours.id = excursions.tour_id
        WHERE excursions.id = attendance.excursion_id
          AND tours.guide_id = auth.uid()
      ));

    CREATE POLICY "Tourists can view their own attendance" ON attendance
      FOR SELECT USING (auth.uid() = tourist_id);
