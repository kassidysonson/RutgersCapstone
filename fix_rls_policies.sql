-- Fix Row Level Security Policies for Users Table
-- Run this script in your Supabase SQL Editor

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (if they exist)
-- ============================================
-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Anon can insert users (dev)" ON public.users;
DROP POLICY IF EXISTS "Anon can select all users (dev)" ON public.users;
DROP POLICY IF EXISTS "Anon can select own users (dev)" ON public.users;

-- ============================================
-- CREATE NEW POLICIES
-- ============================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can view all profiles (for Find Students feature)
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own profile (for signup/profile creation)
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Run this to see all policies on the users table
-- SELECT * FROM pg_policies WHERE tablename = 'users';

