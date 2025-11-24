-- SQL Script to Update Applications Table for Application Form
-- Run this script in your Supabase SQL Editor

-- ============================================
-- APPLICATIONS TABLE UPDATES
-- ============================================
-- Add columns for comprehensive application form

-- Cover Letter (separate from message for more structured data)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS cover_letter text;

-- Resume Link (URL to applicant's resume)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS resume_link text;

-- Portfolio Link (URL to applicant's portfolio)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS portfolio_link text;

-- Availability (when applicant is available)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS availability text;

-- Relevant Experience (description of relevant experience)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS relevant_experience text;

-- Why Interested (why the applicant is interested in the project)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS why_interested text;

-- Application Status (pending, accepted, rejected, withdrawn)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON public.applications(project_id);

-- ============================================
-- UPDATE RLS POLICIES FOR APPLICATIONS
-- ============================================
-- Ensure RLS is enabled
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Project owners can view applications to their projects" ON public.applications;
DROP POLICY IF EXISTS "Authenticated users can create applications" ON public.applications;
DROP POLICY IF EXISTS "Applicants can update their applications" ON public.applications;

-- Create updated policies
-- Users can view their own applications
CREATE POLICY "Users can view their own applications" ON public.applications
  FOR SELECT
  USING (auth.uid() = applicant_id);

-- Project owners can view applications to their projects
CREATE POLICY "Project owners can view applications to their projects" ON public.applications
  FOR SELECT
  USING (auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ));

-- Authenticated users can create applications
CREATE POLICY "Authenticated users can create applications" ON public.applications
  FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Applicants can update their own applications (e.g., to withdraw)
CREATE POLICY "Applicants can update their applications" ON public.applications
  FOR UPDATE
  USING (auth.uid() = applicant_id)
  WITH CHECK (auth.uid() = applicant_id);

-- Project owners can update applications to their projects (e.g., accept/reject)
CREATE POLICY "Project owners can update applications to their projects" ON public.applications
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  ));

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON COLUMN public.applications.cover_letter IS 'Cover letter from the applicant';
COMMENT ON COLUMN public.applications.resume_link IS 'URL to applicant resume';
COMMENT ON COLUMN public.applications.portfolio_link IS 'URL to applicant portfolio';
COMMENT ON COLUMN public.applications.availability IS 'Applicant availability description';
COMMENT ON COLUMN public.applications.relevant_experience IS 'Description of relevant experience';
COMMENT ON COLUMN public.applications.why_interested IS 'Why the applicant is interested in the project';
COMMENT ON COLUMN public.applications.status IS 'Application status: pending, accepted, rejected, withdrawn';

