-- SQL Script to Add Columns for Find Students, Browse Projects, and Post Project Features
-- Run this script in your Supabase SQL Editor

-- ============================================
-- USERS TABLE UPDATES
-- ============================================
-- Add columns for Find Students functionality

-- Major field
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS major text;

-- Academic Year (Freshman, Sophomore, Junior, Senior, Graduate)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS academic_year text;

-- Location
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS location text;

-- Rating (numeric for student ratings)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0.0;

-- Review Count (number of reviews received)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Skills (stored as comma-separated text or JSON array)
-- Using text for simplicity, can be parsed as comma-separated
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS skills text;

-- Availability (e.g., "20 hrs/week")
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS availability text;

-- Projects Completed count
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS projects_completed integer DEFAULT 0;

-- Profile Image (can be URL or initials)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_image text;

-- Experience Level (Beginner, Intermediate, Advanced) - can be calculated but storing for performance
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS experience_level text;

-- ============================================
-- PROJECTS TABLE UPDATES
-- ============================================
-- Add columns for Browse Projects and Post Project functionality

-- Company/Organization name
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS company text;

-- Budget (e.g., "$1,000 - $2,000")
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS budget text;

-- Duration (e.g., "4-6 weeks", "1-2 months", etc.)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS duration text;

-- Experience Level Required (Beginner, Intermediate, Advanced)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS experience_level text;

-- Skills Required (comma-separated or JSON)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS skills text;

-- Preferred Academic Year
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS academic_year text;

-- Preferred Major
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS major text;

-- Availability Needed (e.g., "15-20 hrs/week")
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS availability text;

-- Is Urgent flag
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS is_urgent boolean DEFAULT false;

-- Category (Web Development, Mobile Development, Design, Data Science, Marketing)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category text;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Add indexes for common filter queries

CREATE INDEX IF NOT EXISTS idx_users_major ON public.users(major);
CREATE INDEX IF NOT EXISTS idx_users_academic_year ON public.users(academic_year);
CREATE INDEX IF NOT EXISTS idx_users_experience_level ON public.users(experience_level);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(location);

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_duration ON public.projects(duration);
CREATE INDEX IF NOT EXISTS idx_projects_experience_level ON public.projects(experience_level);
CREATE INDEX IF NOT EXISTS idx_projects_is_urgent ON public.projects(is_urgent);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON COLUMN public.users.major IS 'Student major (e.g., Computer Science, Business, Design)';
COMMENT ON COLUMN public.users.academic_year IS 'Academic year: Freshman, Sophomore, Junior, Senior, Graduate';
COMMENT ON COLUMN public.users.skills IS 'Comma-separated list of skills';
COMMENT ON COLUMN public.users.availability IS 'Availability description (e.g., "20 hrs/week")';
COMMENT ON COLUMN public.users.experience_level IS 'Experience level: Beginner, Intermediate, Advanced';

COMMENT ON COLUMN public.projects.company IS 'Company or organization name posting the project';
COMMENT ON COLUMN public.projects.budget IS 'Project budget range (e.g., "$1,000 - $2,000")';
COMMENT ON COLUMN public.projects.duration IS 'Project duration (e.g., "4-6 weeks", "1-2 months")';
COMMENT ON COLUMN public.projects.skills IS 'Comma-separated list of required skills';
COMMENT ON COLUMN public.projects.category IS 'Project category: Web Development, Mobile Development, Design, Data Science, Marketing';

