-- Create users table
    CREATE TABLE users (
      id uuid REFERENCES auth.users PRIMARY KEY,
      email text UNIQUE,
      full_name text,
      avatar_url text,
      role text CHECK (role IN ('guide', 'tourist')),
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create tours table
    CREATE TABLE tours (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      title text NOT NULL,
      guide_id uuid REFERENCES users(id) NOT NULL,
      start_date timestamp with time zone NOT NULL,
      end_date timestamp with time zone NOT NULL,
      country text NOT NULL,
      status text CHECK (status IN ('planned', 'in_progress', 'completed')) DEFAULT 'planned',
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create tourists table
    CREATE TABLE tourists (
      id uuid REFERENCES users(id) PRIMARY KEY,
      tour_id uuid REFERENCES tours(id) NOT NULL,
      scan_status boolean DEFAULT false,
      notes text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create excursions table
    CREATE TABLE excursions (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      tour_id uuid REFERENCES tours(id) NOT NULL,
      title text NOT NULL,
      description text,
      date timestamp with time zone NOT NULL,
      attendance_count integer DEFAULT 0,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create attendance table
    CREATE TABLE attendance (
      id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
      excursion_id uuid REFERENCES excursions(id) NOT NULL,
      tourist_id uuid REFERENCES tourists(id) NOT NULL,
      status boolean DEFAULT false,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Enable Row Level Security
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
    ALTER TABLE tourists ENABLE ROW LEVEL SECURITY;
    ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

    -- Create indexes for frequently queried columns
    CREATE INDEX idx_tours_guide_id ON tours(guide_id);
    CREATE INDEX idx_tourists_tour_id ON tourists(tour_id);
    CREATE INDEX idx_excursions_tour_id ON excursions(tour_id);
    CREATE INDEX idx_attendance_excursion_id ON attendance(excursion_id);
