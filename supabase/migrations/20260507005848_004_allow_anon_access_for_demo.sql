/*
  # Allow public access to wardrobe data for demo purposes

  1. Modified Tables
    - `wardrobe_items`: Make user_id nullable (for seed data without auth)
    - `outfits`: Make user_id nullable
    - `daily_plans`: Make user_id nullable
    - `outfit_wear_log`: Make user_id nullable
    - `reminders`: Make user_id nullable

  2. Security Changes
    - Add policy for anon key access (read/write) on all tables
    - This enables the demo app to function without user authentication
    - Keep existing authenticated policies for future auth integration

  3. Notes
    - These policies allow the anon key to access data
    - When auth is added later, these can be restricted
*/

-- Make user_id nullable on all tables
ALTER TABLE wardrobe_items ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE outfits ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE daily_plans ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE outfit_wear_log ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE reminders ALTER COLUMN user_id DROP NOT NULL;

-- Wardrobe items: allow anon access
CREATE POLICY "Anon can view wardrobe items"
  ON wardrobe_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert wardrobe items"
  ON wardrobe_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update wardrobe items"
  ON wardrobe_items FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete wardrobe items"
  ON wardrobe_items FOR DELETE
  TO anon
  USING (true);

-- Outfits: allow anon access
CREATE POLICY "Anon can view outfits"
  ON outfits FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert outfits"
  ON outfits FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update outfits"
  ON outfits FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete outfits"
  ON outfits FOR DELETE
  TO anon
  USING (true);

-- Daily plans: allow anon access
CREATE POLICY "Anon can view daily plans"
  ON daily_plans FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert daily plans"
  ON daily_plans FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update daily plans"
  ON daily_plans FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete daily plans"
  ON daily_plans FOR DELETE
  TO anon
  USING (true);

-- Outfit wear log: allow anon access
CREATE POLICY "Anon can view wear log"
  ON outfit_wear_log FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert wear log"
  ON outfit_wear_log FOR INSERT
  TO anon
  WITH CHECK (true);

-- Reminders: allow anon access
CREATE POLICY "Anon can view reminders"
  ON reminders FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert reminders"
  ON reminders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete reminders"
  ON reminders FOR DELETE
  TO anon
  USING (true);
