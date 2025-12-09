-- Migration: add missing profile columns, trigger to create profile on auth.signup, and RLS insert policy

-- 1) Add commonly used columns to profiles table if they don't exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS phone text;

-- 2) Create a trigger function that inserts a row into public.profiles when a new auth.user is created
-- Use CREATE OR REPLACE so the migration is idempotent for the function body
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a basic profile row for the new user. On conflict do nothing to avoid errors.
  INSERT INTO public.profiles (id, full_name, email, company_name, url, address, phone)
    VALUES (NEW.id, NULL, NEW.email, NULL, NULL, NULL, NULL)
    ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3) Create the trigger if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'auth_user_created_trigger' AND c.relname = 'users' AND t.tgenabled <> 'D'
  ) THEN
    CREATE TRIGGER auth_user_created_trigger
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();
  END IF;
END$$;

-- 4) Enable RLS on profiles and add a policy that allows authenticated users to insert their own profile row
-- Enable RLS (no-op if already enabled)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public' AND p.tablename = 'profiles' AND p.policyname = 'allow_insert_own_profile'
  ) THEN
    CREATE POLICY allow_insert_own_profile ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END$$;

-- End migration
