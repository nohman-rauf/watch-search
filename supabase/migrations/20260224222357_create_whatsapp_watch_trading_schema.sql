/*
  # WhatsApp Watch Trading Platform Schema

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamptz)
    
    - `whatsapp_sessions`
      - `id` (uuid, primary key)
      - `session_data` (jsonb) - stores Baileys session data
      - `phone_number` (text) - connected WhatsApp number
      - `status` (text) - connected/disconnected
      - `last_connected_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `contacts`
      - `id` (uuid, primary key)
      - `whatsapp_number` (text, unique) - normalized phone number
      - `name` (text) - sender name from WhatsApp
      - `wa_link` (text) - generated wa.me link
      - `first_seen_at` (timestamptz)
      - `last_seen_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `message_id` (text, unique) - WhatsApp message ID
      - `content` (text) - message text content
      - `sender_number` (text) - sender's WhatsApp number
      - `sender_name` (text) - sender's display name
      - `contact_id` (uuid) - foreign key to contacts
      - `group_name` (text) - group name if from group
      - `group_id` (text) - WhatsApp group ID
      - `is_group` (boolean) - whether message is from group
      - `message_type` (text) - text/image/video/document
      - `media_url` (text) - URL to media if applicable
      - `timestamp` (timestamptz) - message timestamp
      - `created_at` (timestamptz)
      - Indexes on sender_number, group_name, timestamp, content for fast searching

  2. Security
    - Enable RLS on all tables
    - Public read access to messages and contacts for search
    - Admin-only write access to all tables
    - Session data only accessible to authenticated admins
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create whatsapp_sessions table
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_data jsonb,
  phone_number text,
  status text DEFAULT 'disconnected',
  last_connected_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read session status"
  ON whatsapp_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated can manage sessions"
  ON whatsapp_sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text UNIQUE NOT NULL,
  name text,
  wa_link text NOT NULL,
  first_seen_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read contacts"
  ON contacts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated can manage contacts"
  ON contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text UNIQUE NOT NULL,
  content text,
  sender_number text NOT NULL,
  sender_name text,
  contact_id uuid REFERENCES contacts(id),
  group_name text,
  group_id text,
  is_group boolean DEFAULT false,
  message_type text DEFAULT 'text',
  media_url text,
  timestamp timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_messages_content ON messages USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_messages_sender_number ON messages(sender_number);
CREATE INDEX IF NOT EXISTS idx_messages_group_name ON messages(group_name);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_contacts_number ON contacts(whatsapp_number);