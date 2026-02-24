/*
  # Fix Admin Registration Policy

  1. Changes
    - Add policy to allow public admin registration (for initial setup)
    - This allows the first admin to be created without authentication

  2. Security Notes
    - In production, this policy should be removed after creating the first admin
    - Or implement additional checks (like checking if any admin exists)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' 
    AND policyname = 'Allow public admin registration'
  ) THEN
    CREATE POLICY "Allow public admin registration"
      ON admins FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;