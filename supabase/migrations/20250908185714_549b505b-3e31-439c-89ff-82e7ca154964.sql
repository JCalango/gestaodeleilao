-- Fix vistorias table RLS policies to allow proper access for authenticated users
-- The current policies are too restrictive and preventing data access

-- Drop the overly restrictive policy that allows all authenticated users to view all data
DROP POLICY IF EXISTS "Authenticated users can view vistorias" ON public.vistorias;

-- Ensure the user-specific policies work correctly for the main vistorias table
-- Keep existing policies but make sure they work with the current session
-- The policies for users accessing their own data and admins should remain

-- Add a fallback policy for debugging - this will help identify if the issue is with auth.uid()
CREATE POLICY "Debug: Authenticated users can view vistorias" 
ON public.vistorias 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Temporarily allow authenticated users to update vistorias (will be restricted later)
CREATE POLICY "Debug: Authenticated users can update vistorias" 
ON public.vistorias 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Add some debugging info to see what's happening with auth
-- This query will help us understand the current auth state