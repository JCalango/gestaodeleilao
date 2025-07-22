
-- Criar a função de log de atividades do usuário
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_activity_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activities (
    user_id,
    activity_type,
    description,
    metadata,
    created_at
  )
  VALUES (
    auth.uid(),
    p_activity_type,
    p_description,
    p_metadata,
    NOW()
  );
END;
$$;

-- Criar a tabela de atividades do usuário se não existir
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela de atividades
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Política para que usuários vejam apenas suas próprias atividades
CREATE POLICY "Users can view their own activities" ON public.user_activities
FOR SELECT USING (auth.uid() = user_id);

-- Política para que usuários possam inserir suas próprias atividades
CREATE POLICY "Users can insert their own activities" ON public.user_activities
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar o bucket de storage para fotos das vistorias
INSERT INTO storage.buckets (id, name, public)
VALUES ('vistoria-fotos', 'vistoria-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas para o bucket vistoria-fotos
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vistoria-fotos' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'vistoria-fotos' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vistoria-fotos' AND 
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Habilitar RLS no bucket
UPDATE storage.buckets SET public = true WHERE id = 'vistoria-fotos';
