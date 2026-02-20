
-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. User activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all activities" ON public.user_activities FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 3. Vistorias table
CREATE TABLE IF NOT EXISTS public.vistorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_controle TEXT NOT NULL,
  data_inspecao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  placa TEXT, marca TEXT, modelo TEXT, renavam TEXT, cor TEXT,
  ano_fabricacao INT, ano_modelo INT, municipio TEXT, uf TEXT,
  tipo_combustivel TEXT, categoria TEXT, tipo_veiculo TEXT,
  numero_motor TEXT, motor_alterado TEXT, condicao_motor TEXT,
  numero_chassi TEXT, condicao_chassi TEXT,
  furto_roubo BOOLEAN DEFAULT false, restricao_judicial BOOLEAN DEFAULT false,
  restricao_administrativa BOOLEAN DEFAULT false, alienacao_fiduciaria BOOLEAN DEFAULT false,
  observacoes TEXT,
  nome_proprietario TEXT, cpf_cnpj_proprietario TEXT, endereco_proprietario TEXT,
  numero_casa_proprietario TEXT, complemento_proprietario TEXT,
  informacoes_complementares_proprietario TEXT, cep_proprietario TEXT,
  cidade_proprietario TEXT, bairro_proprietario TEXT,
  ipva TEXT, licenciamento TEXT, infracoes_transito TEXT,
  data_entrada_patio TEXT, debito_patio NUMERIC, dados_remocao TEXT,
  possui_comunicacao_venda BOOLEAN DEFAULT false,
  nome_possuidor TEXT, cpf_cnpj_possuidor TEXT, endereco_possuidor TEXT,
  informacoes_complementares_possuidor TEXT, cep_possuidor TEXT,
  cidade_possuidor TEXT, bairro_possuidor TEXT,
  nome_financeira TEXT, cnpj_financeira TEXT, endereco_financeira TEXT,
  numero_endereco_financeira TEXT, bairro_financeira TEXT,
  complemento_financeira TEXT, cep_financeira TEXT, cidade_financeira TEXT,
  fotos_frente TEXT[] DEFAULT '{}', fotos_lateral_esquerda TEXT[] DEFAULT '{}',
  fotos_lateral_direita TEXT[] DEFAULT '{}', fotos_chassi TEXT[] DEFAULT '{}',
  fotos_traseira TEXT[] DEFAULT '{}', fotos_motor TEXT[] DEFAULT '{}'
);
ALTER TABLE public.vistorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vistorias" ON public.vistorias FOR SELECT USING (true);
CREATE POLICY "Users can create vistorias" ON public.vistorias FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own vistorias" ON public.vistorias FOR UPDATE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete vistorias" ON public.vistorias FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_vistorias_updated_at BEFORE UPDATE ON public.vistorias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Damage categories
CREATE TABLE IF NOT EXISTS public.damage_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  vehicle_types TEXT[] NOT NULL DEFAULT '{}',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.damage_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view damage categories" ON public.damage_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage damage categories" ON public.damage_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. Damage items (definitions)
CREATE TABLE IF NOT EXISTS public.damage_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.damage_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vehicle_types TEXT[] NOT NULL DEFAULT '{}',
  requires_photo BOOLEAN NOT NULL DEFAULT false,
  severity_levels TEXT[] NOT NULL DEFAULT '{"M","G"}',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.damage_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view damage items" ON public.damage_items FOR SELECT USING (true);
CREATE POLICY "Admins manage damage items" ON public.damage_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 6. Vehicle damage assessments
CREATE TABLE IF NOT EXISTS public.vehicle_damage_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vistoria_id UUID REFERENCES public.vistorias(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  assessor_name TEXT,
  assessor_registration TEXT,
  assessment_date TEXT,
  vehicle_classification TEXT,
  total_sim_count INT NOT NULL DEFAULT 0,
  total_nao_count INT NOT NULL DEFAULT 0,
  total_na_count INT NOT NULL DEFAULT 0,
  observations TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_damage_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view assessments" ON public.vehicle_damage_assessments FOR SELECT USING (true);
CREATE POLICY "Users can create assessments" ON public.vehicle_damage_assessments FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own assessments" ON public.vehicle_damage_assessments FOR UPDATE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete assessments" ON public.vehicle_damage_assessments FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.vehicle_damage_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Damage assessment items
CREATE TABLE IF NOT EXISTS public.damage_assessment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.vehicle_damage_assessments(id) ON DELETE CASCADE,
  item_definition_id UUID REFERENCES public.damage_items(id),
  item_name TEXT NOT NULL,
  category_name TEXT,
  status public.damage_status NOT NULL DEFAULT 'NA',
  severity public.severity_category,
  photo_url TEXT,
  observations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.damage_assessment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view assessment items" ON public.damage_assessment_items FOR SELECT USING (true);
CREATE POLICY "Users can manage assessment items" ON public.damage_assessment_items FOR ALL USING (true);

-- 8. Handle new user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Reload schema cache
NOTIFY pgrst, 'reload schema';
