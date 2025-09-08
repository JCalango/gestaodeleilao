-- Fix critical security vulnerabilities in vehicle inspection tables
-- These tables contain sensitive personal data and need proper access control

-- 1. Fix Inspec_veícul table - remove dangerous public access policy
DROP POLICY IF EXISTS "AcessGeral" ON public."Inspec_veícul";

-- Add proper RLS policies for Inspec_veícul
CREATE POLICY "Users can view their own inspections" 
ON public."Inspec_veícul" 
FOR SELECT 
USING (auth.uid() = "user");

CREATE POLICY "Users can create their own inspections" 
ON public."Inspec_veícul" 
FOR INSERT 
WITH CHECK (auth.uid() = "user");

CREATE POLICY "Users can update their own inspections" 
ON public."Inspec_veícul" 
FOR UPDATE 
USING (auth.uid() = "user");

CREATE POLICY "Admins can view all inspections" 
ON public."Inspec_veícul" 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all inspections" 
ON public."Inspec_veícul" 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 2. Fix avarias_auto table - remove dangerous public access policy
DROP POLICY IF EXISTS "acessGeral" ON public.avarias_auto;

-- Add proper RLS policies for avarias_auto
CREATE POLICY "Authenticated users can view damage assessments" 
ON public.avarias_auto 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create damage assessments" 
ON public.avarias_auto 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all damage assessments" 
ON public.avarias_auto 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 3. Fix avarias_moto table - remove dangerous public access policy
DROP POLICY IF EXISTS "ACESSGERAL" ON public.avarias_moto;

-- Add proper RLS policies for avarias_moto
CREATE POLICY "Authenticated users can view moto damage assessments" 
ON public.avarias_moto 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create moto damage assessments" 
ON public.avarias_moto 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all moto damage assessments" 
ON public.avarias_moto 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 4. Fix new_user table - remove dangerous public access policy
DROP POLICY IF EXISTS "AcessGeral" ON public.new_user;

-- Add proper RLS policies for new_user
CREATE POLICY "Users can view their own profile" 
ON public.new_user 
FOR SELECT 
USING (auth.uid() = user_ref);

CREATE POLICY "Users can update their own profile" 
ON public.new_user 
FOR UPDATE 
USING (auth.uid() = user_ref);

CREATE POLICY "Admins can view all user profiles" 
ON public.new_user 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all user profiles" 
ON public.new_user 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 5. Enable RLS on Inspec_veícul_prefeitura table (currently has no policies)
ALTER TABLE public."Inspec_veícul_prefeitura" ENABLE ROW LEVEL SECURITY;

-- Add proper RLS policies for Inspec_veícul_prefeitura
CREATE POLICY "Users can view their own prefecture inspections" 
ON public."Inspec_veícul_prefeitura" 
FOR SELECT 
USING (auth.uid() = "user");

CREATE POLICY "Users can create their own prefecture inspections" 
ON public."Inspec_veícul_prefeitura" 
FOR INSERT 
WITH CHECK (auth.uid() = "user");

CREATE POLICY "Users can update their own prefecture inspections" 
ON public."Inspec_veícul_prefeitura" 
FOR UPDATE 
USING (auth.uid() = "user");

CREATE POLICY "Admins can view all prefecture inspections" 
ON public."Inspec_veícul_prefeitura" 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all prefecture inspections" 
ON public."Inspec_veícul_prefeitura" 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));