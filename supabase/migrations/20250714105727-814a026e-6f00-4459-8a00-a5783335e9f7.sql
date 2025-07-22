
-- Create damage categories table
CREATE TABLE public.damage_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  vehicle_types TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create damage items table
CREATE TABLE public.damage_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.damage_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vehicle_types TEXT[] NOT NULL DEFAULT '{}',
  requires_photo BOOLEAN NOT NULL DEFAULT false,
  severity_levels TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicle damage assessments table
CREATE TABLE public.vehicle_damage_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vistoria_id TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  assessor_name TEXT,
  assessor_registration TEXT,
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  vehicle_classification TEXT,
  total_sim_count INTEGER NOT NULL DEFAULT 0,
  total_nao_count INTEGER NOT NULL DEFAULT 0,
  total_na_count INTEGER NOT NULL DEFAULT 0,
  observations TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create damage assessment items table
CREATE TABLE public.damage_assessment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.vehicle_damage_assessments(id) ON DELETE CASCADE,
  damage_item_id UUID NOT NULL REFERENCES public.damage_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('SIM', 'NAO', 'NA')),
  severity TEXT CHECK (severity IN ('M', 'G')),
  notes TEXT,
  requires_repair BOOLEAN NOT NULL DEFAULT false,
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.damage_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_damage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.damage_assessment_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for damage_categories
CREATE POLICY "Authenticated users can view damage categories" 
  ON public.damage_categories 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage damage categories" 
  ON public.damage_categories 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for damage_items
CREATE POLICY "Authenticated users can view damage items" 
  ON public.damage_items 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage damage items" 
  ON public.damage_items 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for vehicle_damage_assessments
CREATE POLICY "Users can view assessments" 
  ON public.vehicle_damage_assessments 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create assessments" 
  ON public.vehicle_damage_assessments 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own assessments" 
  ON public.vehicle_damage_assessments 
  FOR UPDATE 
  USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can delete assessments" 
  ON public.vehicle_damage_assessments 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Create RLS policies for damage_assessment_items
CREATE POLICY "Users can view assessment items" 
  ON public.damage_assessment_items 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage assessment items" 
  ON public.damage_assessment_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicle_damage_assessments vda 
      WHERE vda.id = assessment_id 
      AND (vda.created_by = auth.uid() OR has_role(auth.uid(), 'admin'::user_role))
    )
  );

-- Create trigger to update assessment counts
CREATE OR REPLACE FUNCTION public.update_assessment_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vehicle_damage_assessments
  SET 
    total_sim_count = (
      SELECT COUNT(*) FROM public.damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'SIM'
    ),
    total_nao_count = (
      SELECT COUNT(*) FROM public.damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'NAO'
    ),
    total_na_count = (
      SELECT COUNT(*) FROM public.damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'NA'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.assessment_id, OLD.assessment_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_assessment_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.damage_assessment_items
  FOR EACH ROW EXECUTE FUNCTION public.update_assessment_counts();

-- Insert sample data for automobile damage categories and items
INSERT INTO public.damage_categories (name, description, vehicle_types, display_order) VALUES
('Carroceria', 'Avaliação da carroceria do veículo', ARRAY['monobloco'], 1),
('Motor', 'Avaliação do motor e sistema de propulsão', ARRAY['monobloco', 'chassi', 'onibus'], 2),
('Rodas e Pneus', 'Avaliação de rodas, pneus e suspensão', ARRAY['monobloco', 'moto', 'chassi', 'onibus'], 3),
('Interior', 'Avaliação do interior do veículo', ARRAY['monobloco', 'onibus'], 4),
('Elétrica', 'Sistema elétrico e eletrônico', ARRAY['monobloco', 'moto', 'chassi', 'onibus'], 5),
('Chassi/Estrutura', 'Estrutura principal do veículo', ARRAY['moto', 'chassi'], 6);

-- Insert sample damage items for automobile
WITH cat_ids AS (
  SELECT id, name FROM public.damage_categories
)
INSERT INTO public.damage_items (category_id, name, description, vehicle_types, requires_photo, severity_levels, display_order) 
SELECT 
  c.id,
  item.name,
  item.description,
  item.vehicle_types,
  item.requires_photo,
  item.severity_levels,
  item.display_order
FROM cat_ids c
CROSS JOIN (
  VALUES
  -- Carroceria items
  ('Carroceria', 'Para-choque dianteiro', 'Estado do para-choque dianteiro', ARRAY['monobloco'], true, ARRAY['M', 'G'], 1),
  ('Carroceria', 'Para-choque traseiro', 'Estado do para-choque traseiro', ARRAY['monobloco'], true, ARRAY['M', 'G'], 2),
  ('Carroceria', 'Porta dianteira direita', 'Estado da porta dianteira direita', ARRAY['monobloco'], true, ARRAY['M', 'G'], 3),
  ('Carroceria', 'Porta dianteira esquerda', 'Estado da porta dianteira esquerda', ARRAY['monobloco'], true, ARRAY['M', 'G'], 4),
  ('Carroceria', 'Porta traseira direita', 'Estado da porta traseira direita', ARRAY['monobloco'], true, ARRAY['M', 'G'], 5),
  ('Carroceria', 'Porta traseira esquerda', 'Estado da porta traseira esquerda', ARRAY['monobloco'], true, ARRAY['M', 'G'], 6),
  ('Carroceria', 'Capô', 'Estado do capô', ARRAY['monobloco'], true, ARRAY['M', 'G'], 7),
  ('Carroceria', 'Tampa traseira', 'Estado da tampa traseira/porta-malas', ARRAY['monobloco'], true, ARRAY['M', 'G'], 8),
  ('Carroceria', 'Teto', 'Estado do teto', ARRAY['monobloco'], true, ARRAY['M', 'G'], 9),
  ('Carroceria', 'Lateral direita', 'Estado da lateral direita', ARRAY['monobloco'], true, ARRAY['M', 'G'], 10),
  ('Carroceria', 'Lateral esquerda', 'Estado da lateral esquerda', ARRAY['monobloco'], true, ARRAY['M', 'G'], 11),
  
  -- Motor items
  ('Motor', 'Motor', 'Estado geral do motor', ARRAY['monobloco', 'chassi', 'onibus'], true, ARRAY['M', 'G'], 1),
  ('Motor', 'Radiador', 'Estado do radiador', ARRAY['monobloco', 'chassi', 'onibus'], true, ARRAY['M', 'G'], 2),
  ('Motor', 'Bateria', 'Estado da bateria', ARRAY['monobloco', 'moto', 'chassi', 'onibus'], false, ARRAY['M', 'G'], 3),
  
  -- Rodas e Pneus items
  ('Rodas e Pneus', 'Pneu dianteiro direito', 'Estado do pneu dianteiro direito', ARRAY['monobloco', 'moto'], true, ARRAY['M', 'G'], 1),
  ('Rodas e Pneus', 'Pneu dianteiro esquerdo', 'Estado do pneu dianteiro esquerdo', ARRAY['monobloco'], true, ARRAY['M', 'G'], 2),
  ('Rodas e Pneus', 'Pneu traseiro direito', 'Estado do pneu traseiro direito', ARRAY['monobloco', 'moto'], true, ARRAY['M', 'G'], 3),
  ('Rodas e Pneus', 'Pneu traseiro esquerdo', 'Estado do pneu traseiro esquerdo', ARRAY['monobloco'], true, ARRAY['M', 'G'], 4),
  
  -- Interior items
  ('Interior', 'Bancos', 'Estado dos bancos', ARRAY['monobloco', 'onibus'], true, ARRAY['M', 'G'], 1),
  ('Interior', 'Painel', 'Estado do painel de instrumentos', ARRAY['monobloco', 'onibus'], true, ARRAY['M', 'G'], 2),
  ('Interior', 'Volante', 'Estado do volante', ARRAY['monobloco', 'onibus'], false, ARRAY['M', 'G'], 3),
  
  -- Elétrica items
  ('Elétrica', 'Faróis dianteiros', 'Estado dos faróis dianteiros', ARRAY['monobloco', 'moto', 'chassi', 'onibus'], true, ARRAY['M', 'G'], 1),
  ('Elétrica', 'Lanternas traseiras', 'Estado das lanternas traseiras', ARRAY['monobloco', 'moto', 'chassi', 'onibus'], true, ARRAY['M', 'G'], 2),
  
  -- Chassi/Estrutura items for moto
  ('Chassi/Estrutura', 'Guidão', 'Estado do guidão', ARRAY['moto'], true, ARRAY['M', 'G'], 1),
  ('Chassi/Estrutura', 'Escapamento', 'Estado do escapamento', ARRAY['moto'], true, ARRAY['M', 'G'], 2),
  ('Chassi/Estrutura', 'Pedal de freio', 'Estado do pedal de freio', ARRAY['moto'], false, ARRAY['M', 'G'], 3)
) AS item(category, name, description, vehicle_types, requires_photo, severity_levels, display_order)
WHERE c.name = item.category;
