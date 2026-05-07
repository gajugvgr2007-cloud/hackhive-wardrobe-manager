/*
  # Add outfit wear log and reminders tables

  1. New Tables
    - `outfit_wear_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `outfit_id` (uuid, references outfits)
      - `worn_date` (date, the date the outfit was worn)
      - `created_at` (timestamptz)
      - Tracks every time an outfit is worn for repeat detection
    - `reminders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `daily_plan_id` (uuid, references daily_plans)
      - `remind_at` (timestamptz, when to send reminder)
      - `message` (text, reminder message)
      - `is_sent` (boolean, whether reminder was sent)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Unique constraint on outfit_wear_log to prevent duplicate entries per day
*/

-- Outfit wear log table
CREATE TABLE IF NOT EXISTS outfit_wear_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  worn_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, outfit_id, worn_date)
);

ALTER TABLE outfit_wear_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wear log"
  ON outfit_wear_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wear log"
  ON outfit_wear_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wear log"
  ON outfit_wear_log FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_plan_id uuid REFERENCES daily_plans(id) ON DELETE CASCADE,
  remind_at timestamptz NOT NULL,
  message text NOT NULL DEFAULT '',
  is_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_outfit_wear_log_user_date ON outfit_wear_log(user_id, worn_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_sent ON reminders(user_id, is_sent, remind_at);
