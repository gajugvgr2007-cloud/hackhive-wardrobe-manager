/*
  # Crypto Fashion - Wardrobe Management Schema

  1. New Tables
    - `wardrobe_items` - User's clothing items
    - `outfits` - Outfit combinations
    - `outfit_items` - Join table for outfits and items
    - `daily_plans` - Daily outfit planning

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Policies for full CRUD operations on own data

  3. Details
    All tables include timestamps for tracking creation and updates
*/

-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  color text,
  size text,
  brand text,
  image_url text,
  times_worn integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  rating integer DEFAULT 5,
  occasions text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfit_items join table
CREATE TABLE IF NOT EXISTS outfit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES wardrobe_items(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(outfit_id, item_id)
);

-- Create daily_plans table
CREATE TABLE IF NOT EXISTS daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id uuid REFERENCES outfits(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  event_date date NOT NULL,
  event_time time,
  weather_condition text,
  temperature integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

-- Policies for wardrobe_items
CREATE POLICY "Users can view own wardrobe items"
  ON wardrobe_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wardrobe items"
  ON wardrobe_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wardrobe items"
  ON wardrobe_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wardrobe items"
  ON wardrobe_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for outfits
CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for outfit_items
CREATE POLICY "Users can view outfit items for their outfits"
  ON outfit_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert outfit items for their outfits"
  ON outfit_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    ) AND
    EXISTS (
      SELECT 1 FROM wardrobe_items
      WHERE wardrobe_items.id = outfit_items.item_id
      AND wardrobe_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete outfit items for their outfits"
  ON outfit_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

-- Policies for daily_plans
CREATE POLICY "Users can view own daily plans"
  ON daily_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily plans"
  ON daily_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily plans"
  ON daily_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily plans"
  ON daily_plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_user_id ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_category ON wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_item_id ON outfit_items(item_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_id ON daily_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(event_date);
