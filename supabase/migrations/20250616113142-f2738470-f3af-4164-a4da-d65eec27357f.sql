
-- Primeiro, vamos remover a tabela existente vistorias e criar uma nova com todos os campos necessários
DROP TABLE IF EXISTS public.vistorias;

-- Criar a tabela vistorias com todos os campos necessários
CREATE TABLE public.vistorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_controle VARCHAR NOT NULL,
  data_inspecao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Informações do veículo
  placa VARCHAR,
  marca VARCHAR,
  modelo VARCHAR,
  renavam VARCHAR,
  cor VARCHAR,
  ano_fabricacao INTEGER,
  ano_modelo INTEGER,
  municipio VARCHAR,
  uf VARCHAR,
  tipo_combustivel VARCHAR,
  categoria VARCHAR,
  numero_motor VARCHAR,
  condicao_motor VARCHAR,
  numero_chassi VARCHAR,
  condicao_chassi VARCHAR,
  furto_roubo BOOLEAN DEFAULT FALSE,
  restricao_judicial BOOLEAN DEFAULT FALSE,
  restricao_administrativa BOOLEAN DEFAULT FALSE,
  alienacao_fiduciaria BOOLEAN DEFAULT FALSE,
  observacoes TEXT,
  
  -- Informações do proprietário
  nome_proprietario VARCHAR,
  cpf_cnpj_proprietario VARCHAR,
  endereco_proprietario VARCHAR,
  numero_casa_proprietario VARCHAR,
  complemento_proprietario VARCHAR,
  informacoes_complementares_proprietario TEXT,
  cep_proprietario VARCHAR,
  cidade_proprietario VARCHAR,
  bairro_proprietario VARCHAR,
  
  -- Informações de débitos do veículo
  ipva VARCHAR,
  licenciamento VARCHAR,
  infracoes_transito TEXT,
  data_entrada_patio DATE,
  debito_patio DECIMAL(10,2),
  dados_remocao TEXT,
  
  -- Comunicação de venda
  possui_comunicacao_venda BOOLEAN DEFAULT FALSE,
  nome_possuidor VARCHAR,
  cpf_cnpj_possuidor VARCHAR,
  endereco_possuidor VARCHAR,
  informacoes_complementares_possuidor TEXT,
  cep_possuidor VARCHAR,
  cidade_possuidor VARCHAR,
  bairro_possuidor VARCHAR,
  
  -- Informações da financeira
  nome_financeira VARCHAR,
  cnpj_financeira VARCHAR,
  endereco_financeira VARCHAR,
  numero_endereco_financeira VARCHAR,
  bairro_financeira VARCHAR,
  complemento_financeira VARCHAR,
  cep_financeira VARCHAR,
  cidade_financeira VARCHAR,
  
  -- Fotos do veículo (arrays de URLs)
  fotos_frente TEXT[],
  fotos_lateral_esquerda TEXT[],
  fotos_lateral_direita TEXT[],
  fotos_chassi TEXT[],
  fotos_traseira TEXT[],
  fotos_motor TEXT[]
);

-- Habilitar RLS
ALTER TABLE public.vistorias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Usuários podem ver suas próprias vistorias
CREATE POLICY "Users can view own vistorias"
  ON public.vistorias
  FOR SELECT
  USING (auth.uid() = created_by);

-- Admins podem ver todas as vistorias
CREATE POLICY "Admins can view all vistorias"
  ON public.vistorias
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Usuários podem inserir vistorias
CREATE POLICY "Users can insert vistorias"
  ON public.vistorias
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Usuários podem atualizar suas próprias vistorias
CREATE POLICY "Users can update own vistorias"
  ON public.vistorias
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Admins podem atualizar todas as vistorias
CREATE POLICY "Admins can update all vistorias"
  ON public.vistorias
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Criar bucket para fotos se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('vistoria-fotos', 'vistoria-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket de fotos
CREATE POLICY "Anyone can view vistoria photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vistoria-fotos');

CREATE POLICY "Authenticated users can upload vistoria photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vistoria-fotos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own vistoria photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vistoria-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own vistoria photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vistoria-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
