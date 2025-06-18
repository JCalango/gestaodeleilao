
-- Criar tabela para configurações do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL Security;

-- Política para permitir que usuários autenticados leiam as configurações
CREATE POLICY "Authenticated users can view settings" 
  ON public.system_settings 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Política para permitir que apenas administradores modifiquem as configurações
CREATE POLICY "Only admins can modify settings" 
  ON public.system_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inserir configurações padrão para os logos
INSERT INTO public.system_settings (setting_key, setting_value) 
VALUES 
  ('prefeitura_logo', NULL),
  ('smtran_logo', NULL)
ON CONFLICT (setting_key) DO NOTHING;
