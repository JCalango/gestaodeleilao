
-- Criar bucket para logos do sistema
INSERT INTO storage.buckets (id, name, public) 
VALUES ('system-logos', 'system-logos', true);

-- Criar políticas para o bucket de logos do sistema
CREATE POLICY "Anyone can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'system-logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'system-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'system-logos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Only admins can delete logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'system-logos' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Verificar se o bucket vistoria-fotos existe, se não, criar
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vistoria-fotos', 'vistoria-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas para RLS nas tabelas principais
ALTER TABLE public.vistorias ENABLE ROW LEVEL SECURITY;

-- Política para visualizar vistorias
CREATE POLICY "Authenticated users can view vistorias" 
ON public.vistorias FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política para inserir vistorias
CREATE POLICY "Authenticated users can create vistorias" 
ON public.vistorias FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Política para atualizar vistorias
CREATE POLICY "Users can update their own vistorias or admins can update any" 
ON public.vistorias FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND (
    created_by = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
);

-- Política para deletar vistorias (apenas admins)
CREATE POLICY "Only admins can delete vistorias" 
ON public.vistorias FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Habilitar RLS na tabela profiles se não estiver habilitada
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para visualizar profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para atualizar o próprio profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);
