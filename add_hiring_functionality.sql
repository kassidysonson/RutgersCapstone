-- SQL Script to Add Hiring and Project Closing Functionality
-- Run this script in your Supabase SQL Editor

-- ============================================
-- APPLICATIONS TABLE UPDATES
-- ============================================
-- Add role field for hired students
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS role text;

-- Update status to include 'hired' status
-- Status values: pending, accepted, rejected, withdrawn, hired

-- ============================================
-- PROJECTS TABLE UPDATES
-- ============================================
-- Add fields for project status and hiring management
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS max_hires integer;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS current_hires integer DEFAULT 0;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applications_role ON public.applications(role);
CREATE INDEX IF NOT EXISTS idx_applications_status_hired ON public.applications(status) WHERE status = 'hired';
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects(is_active);

-- ============================================
-- UPDATE RLS POLICIES
-- ============================================
-- Project owners can update applications to their projects (including hiring)
-- This policy already exists but ensure it allows status and role updates
DROP POLICY IF EXISTS "Project owners can update applications to their projects" ON public.applications;

CREATE POLICY "Project owners can update applications to their projects" ON public.applications
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ));

-- Project owners can update their own projects (including closing them)
DROP POLICY IF EXISTS "Project owners can update their own projects" ON public.projects;
CREATE POLICY "Project owners can update their own projects" ON public.projects
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON COLUMN public.applications.role IS 'Role assigned to hired student (e.g., "Frontend Developer", "Data Analyst")';
COMMENT ON COLUMN public.projects.is_active IS 'Whether the project is still accepting applications (false = closed/taken down)';
COMMENT ON COLUMN public.projects.max_hires IS 'Maximum number of students to hire for this project';
COMMENT ON COLUMN public.projects.current_hires IS 'Current number of students hired for this project';

