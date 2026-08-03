/*
# Parent Feature Tables for TutorKonnect

## Purpose
Adds the database layer for the Parent role: parent profiles, parent-ward (student) linking with approval workflow, and parent-specific notifications. These tables live in Supabase and are accessed directly from the Expo frontend via the Supabase JS client. They reference the existing `profiles` table (managed by the TypeORM backend) via foreign keys to `auth.users(id)`.

## New Tables

### 1. `parent_profiles`
Extends a user's `profiles` row with parent-specific metadata.
- `id` (uuid, PK, references `auth.users(id)`) — same as the user's auth ID
- `full_name` (text) — display name
- `phone_number` (text) — contact phone
- `avatar_url` (text, nullable) — profile photo URL
- `notification_prefs` (jsonb, default '{}') — per-category notification toggles
- `created_at`, `updated_at` (timestamptz)

### 2. `parent_ward_links`
Represents a parent-ward (student) relationship. Requires explicit student approval before access is granted.
- `id` (uuid, PK)
- `parent_id` (uuid, references `auth.users(id)`, CASCADE) — the parent
- `ward_id` (uuid, references `auth.users(id)`, CASCADE) — the student
- `status` (text, CHECK in 'pending','approved','rejected','revoked') — linking status
- `relation` (text, nullable) — e.g. "Mother", "Father", "Guardian"
- `parent_code` (text, nullable) — the code the parent used to initiate linking
- `requested_at` (timestamptz) — when the parent requested
- `responded_at` (timestamptz, nullable) — when the student approved/rejected
- `created_at`, `updated_at` (timestamptz)

### 3. `parent_notifications`
Notifications targeted at parents: lesson bookings, cancellations, tutor changes, homework, attendance, payments, progress reports, linking requests.
- `id` (uuid, PK)
- `parent_id` (uuid, references `auth.users(id)`, CASCADE)
- `ward_id` (uuid, references `auth.users(id)`, nullable, CASCADE) — optional, if notification is about a specific ward
- `type` (text) — notification category: 'lesson_booking','lesson_cancellation','tutor_change','homework','attendance','payment','progress_report','linking_request','linking_approved','linking_rejected'
- `title` (text)
- `body` (text)
- `data` (jsonb, default '{}') — arbitrary payload (booking_id, tutor_id, etc.)
- `is_read` (boolean, default false)
- `created_at` (timestamptz)

## Security (RLS)
All tables have RLS enabled. Policies follow the ownership pattern:
- `parent_profiles`: owner can SELECT, INSERT, UPDATE their own row
- `parent_ward_links`: parent can SELECT/INSERT/UPDATE their own links; ward (student) can SELECT links where they are the ward, and can UPDATE status (approve/reject)
- `parent_notifications`: owner can SELECT, INSERT, UPDATE (mark read) their own notifications

## Important Notes
1. These tables are designed to coexist with the existing TypeORM-managed tables (profiles, bookings, etc.) which the backend creates. The parent tables are Supabase-native.
2. The `ward_id` references `auth.users(id)` — the student's auth user ID. This allows parents to query ward data from existing tables (profiles, bookings) via Supabase.
3. The linking workflow: parent creates a `parent_ward_links` row with status='pending' → student sees it and updates status to 'approved' or 'rejected' → parent can then see ward data.
4. A unique partial index on `(parent_id, ward_id) WHERE status = 'approved'` prevents duplicate approved links.
*/

-- ============================================================
-- 1. parent_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS parent_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone_number text NOT NULL DEFAULT '',
  avatar_url text,
  notification_prefs jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_parent_profile" ON parent_profiles;
CREATE POLICY "select_own_parent_profile"
  ON parent_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_parent_profile" ON parent_profiles;
CREATE POLICY "insert_own_parent_profile"
  ON parent_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_parent_profile" ON parent_profiles;
CREATE POLICY "update_own_parent_profile"
  ON parent_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. parent_ward_links
-- ============================================================
CREATE TABLE IF NOT EXISTS parent_ward_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ward_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  relation text,
  parent_code text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE parent_ward_links ENABLE ROW LEVEL SECURITY;

-- Parent: full CRUD on their own links
DROP POLICY IF EXISTS "select_own_ward_links" ON parent_ward_links;
CREATE POLICY "select_own_ward_links"
  ON parent_ward_links FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id OR auth.uid() = ward_id);

DROP POLICY IF EXISTS "insert_own_ward_links" ON parent_ward_links;
CREATE POLICY "insert_own_ward_links"
  ON parent_ward_links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "update_own_ward_links" ON parent_ward_links;
CREATE POLICY "update_own_ward_links"
  ON parent_ward_links FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_id OR auth.uid() = ward_id)
  WITH CHECK (auth.uid() = parent_id OR auth.uid() = ward_id);

DROP POLICY IF EXISTS "delete_own_ward_links" ON parent_ward_links;
CREATE POLICY "delete_own_ward_links"
  ON parent_ward_links FOR DELETE
  TO authenticated
  USING (auth.uid() = parent_id);

-- Prevent duplicate approved links
CREATE UNIQUE INDEX IF NOT EXISTS uniq_approved_parent_ward
  ON parent_ward_links (parent_id, ward_id)
  WHERE status = 'approved';

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_ward_links_parent ON parent_ward_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_ward_links_ward ON parent_ward_links(ward_id);
CREATE INDEX IF NOT EXISTS idx_ward_links_status ON parent_ward_links(status);

-- ============================================================
-- 3. parent_notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS parent_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ward_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE parent_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_parent_notifications" ON parent_notifications;
CREATE POLICY "select_own_parent_notifications"
  ON parent_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "insert_own_parent_notifications" ON parent_notifications;
CREATE POLICY "insert_own_parent_notifications"
  ON parent_notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "update_own_parent_notifications" ON parent_notifications;
CREATE POLICY "update_own_parent_notifications"
  ON parent_notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "delete_own_parent_notifications" ON parent_notifications;
CREATE POLICY "delete_own_parent_notifications"
  ON parent_notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = parent_id);

CREATE INDEX IF NOT EXISTS idx_parent_notifications_parent ON parent_notifications(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_notifications_read ON parent_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_parent_notifications_created ON parent_notifications(created_at DESC);

-- ============================================================
-- Trigger: update_updated_at for parent_profiles and parent_ward_links
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_parent_profiles_updated ON parent_profiles;
CREATE TRIGGER trg_parent_profiles_updated
  BEFORE UPDATE ON parent_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_parent_ward_links_updated ON parent_ward_links;
CREATE TRIGGER trg_parent_ward_links_updated
  BEFORE UPDATE ON parent_ward_links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
