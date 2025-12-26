-- Enable RLS on reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON reports;
DROP POLICY IF EXISTS "Admins can do everything" ON reports;
DROP POLICY IF EXISTS "Enable read access for all users" ON reports;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reports;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON reports;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON reports;

-- Create comprehensive policies

-- 1. View: Users can view all reports (refId sharing requirement + global visibility for techs)
-- If you want strictly own reports, change to: auth.uid() = user_id OR exists(...)
CREATE POLICY "Enable read access for authenticated users"
ON reports FOR SELECT
TO authenticated
USING (true);

-- 2. Insert: Users can insert their own reports
CREATE POLICY "Enable insert for authenticated users"
ON reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Update: Users can update their own reports OR Admins can update any
CREATE POLICY "Enable update for owners and admins"
ON reports FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- 4. Delete: Users can delete their own reports OR Admins can delete any
CREATE POLICY "Enable delete for owners and admins"
ON reports FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id 
  OR 
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
);
