INSERT INTO public.profiles (id, full_name, email, role)
VALUES ('6a9ccf39-2819-4259-9910-aaae9c7c1fb8', 'SMTRAN', 'smtran@smtran.com', 'admin')
ON CONFLICT (id) DO NOTHING;