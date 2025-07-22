/*
  # Create unified damage assessment system

  1. New Tables
    - `damage_categories` - Categories of damage items (e.g., "Exterior", "Interior", "Mechanical")
    - `damage_items` - Specific damage items that can be assessed
    - `vehicle_damage_assessments` - Main assessment records
    - `damage_assessment_items` - Individual item assessments within an assessment
    - `assessment_photos` - Photos associated with damage assessments

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users and admins
    - Ensure data isolation per user/organization

  3. Integration
    - Links to existing `vistorias` table
    - Compatible with legacy `avarias_auto` and `avarias_moto` tables
    - Supports different vehicle types (auto, moto, chassi, onibus)
*/

-- Create enum for damage status if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'damage_status') THEN
    CREATE TYPE damage_status AS ENUM ('SIM', 'NAO', 'NA');
  END IF;
END $$;

-- Create enum for report type if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_type') THEN
    CREATE TYPE report_type AS ENUM ('monobloco', 'moto', 'chassi', 'onibus');
  END IF;
END $$;

-- Create enum for severity category if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_category') THEN
    CREATE TYPE severity_category AS ENUM ('M', 'G');
  END IF;
END $$;

-- Create damage categories table
CREATE TABLE IF NOT EXISTS damage_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  vehicle_types report_type[] DEFAULT ARRAY['monobloco', 'moto', 'chassi', 'onibus']::report_type[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create damage items table
CREATE TABLE IF NOT EXISTS damage_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES damage_categories(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  vehicle_types report_type[] DEFAULT ARRAY['monobloco', 'moto', 'chassi', 'onibus']::report_type[],
  requires_photo BOOLEAN DEFAULT FALSE,
  severity_levels severity_category[] DEFAULT ARRAY['M', 'G']::severity_category[],
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle damage assessments table
CREATE TABLE IF NOT EXISTS vehicle_damage_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vistoria_id UUID REFERENCES vistorias(id) ON DELETE CASCADE,
  vehicle_type report_type NOT NULL DEFAULT 'monobloco',
  assessor_name VARCHAR,
  assessor_registration VARCHAR,
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  vehicle_classification VARCHAR,
  total_sim_count INTEGER DEFAULT 0,
  total_nao_count INTEGER DEFAULT 0,
  total_na_count INTEGER DEFAULT 0,
  observations TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create damage assessment items table
CREATE TABLE IF NOT EXISTS damage_assessment_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES vehicle_damage_assessments(id) ON DELETE CASCADE,
  damage_item_id UUID REFERENCES damage_items(id) ON DELETE CASCADE,
  status damage_status NOT NULL,
  severity severity_category,
  notes TEXT,
  requires_repair BOOLEAN DEFAULT FALSE,
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, damage_item_id)
);

-- Create assessment photos table
CREATE TABLE IF NOT EXISTS assessment_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES vehicle_damage_assessments(id) ON DELETE CASCADE,
  assessment_item_id UUID REFERENCES damage_assessment_items(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type VARCHAR DEFAULT 'damage',
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE damage_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_damage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for damage_categories
CREATE POLICY "Anyone can view damage categories"
  ON damage_categories FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage damage categories"
  ON damage_categories FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for damage_items
CREATE POLICY "Anyone can view damage items"
  ON damage_items FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage damage items"
  ON damage_items FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicle_damage_assessments
CREATE POLICY "Users can view own assessments"
  ON vehicle_damage_assessments FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Admins can view all assessments"
  ON vehicle_damage_assessments FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create assessments"
  ON vehicle_damage_assessments FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON vehicle_damage_assessments FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Admins can update all assessments"
  ON vehicle_damage_assessments FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for damage_assessment_items
CREATE POLICY "Users can view own assessment items"
  ON damage_assessment_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vehicle_damage_assessments vda
      WHERE vda.id = assessment_id
      AND (vda.created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can manage own assessment items"
  ON damage_assessment_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vehicle_damage_assessments vda
      WHERE vda.id = assessment_id
      AND (vda.created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

-- RLS Policies for assessment_photos
CREATE POLICY "Users can view assessment photos"
  ON assessment_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vehicle_damage_assessments vda
      WHERE vda.id = assessment_id
      AND (vda.created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can manage assessment photos"
  ON assessment_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vehicle_damage_assessments vda
      WHERE vda.id = assessment_id
      AND (vda.created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
    )
  );

-- Insert default damage categories
INSERT INTO damage_categories (name, description, vehicle_types, display_order) VALUES
('Exterior', 'Danos externos do veículo', ARRAY['monobloco', 'moto', 'chassi', 'onibus']::report_type[], 1),
('Interior', 'Danos internos do veículo', ARRAY['monobloco', 'moto', 'onibus']::report_type[], 2),
('Mecânico', 'Danos mecânicos e do motor', ARRAY['monobloco', 'moto', 'chassi', 'onibus']::report_type[], 3),
('Elétrico', 'Danos no sistema elétrico', ARRAY['monobloco', 'moto', 'onibus']::report_type[], 4),
('Chassi/Estrutura', 'Danos estruturais', ARRAY['monobloco', 'chassi', 'onibus']::report_type[], 5),
('Específico Moto', 'Itens específicos para motocicletas', ARRAY['moto']::report_type[], 6);

-- Insert default damage items for automobiles (monobloco)
INSERT INTO damage_items (category_id, name, description, vehicle_types, requires_photo, display_order)
SELECT 
  dc.id,
  item.name,
  item.description,
  ARRAY['monobloco']::report_type[],
  item.requires_photo,
  item.display_order
FROM damage_categories dc
CROSS JOIN (VALUES
  -- Exterior items
  ('Exterior', 'Para-choque dianteiro', 'Estado do para-choque dianteiro', true, 1),
  ('Exterior', 'Para-choque traseiro', 'Estado do para-choque traseiro', true, 2),
  ('Exterior', 'Capô', 'Estado do capô do motor', true, 3),
  ('Exterior', 'Porta-malas', 'Estado do porta-malas', true, 4),
  ('Exterior', 'Porta dianteira direita', 'Estado da porta dianteira direita', true, 5),
  ('Exterior', 'Porta dianteira esquerda', 'Estado da porta dianteira esquerda', true, 6),
  ('Exterior', 'Porta traseira direita', 'Estado da porta traseira direita', true, 7),
  ('Exterior', 'Porta traseira esquerda', 'Estado da porta traseira esquerda', true, 8),
  ('Exterior', 'Farol dianteiro direito', 'Estado do farol dianteiro direito', true, 9),
  ('Exterior', 'Farol dianteiro esquerdo', 'Estado do farol dianteiro esquerdo', true, 10),
  ('Exterior', 'Lanterna traseira direita', 'Estado da lanterna traseira direita', true, 11),
  ('Exterior', 'Lanterna traseira esquerda', 'Estado da lanterna traseira esquerda', true, 12),
  ('Exterior', 'Para-brisa', 'Estado do para-brisa', true, 13),
  ('Exterior', 'Vidro traseiro', 'Estado do vidro traseiro', true, 14),
  ('Exterior', 'Retrovisor direito', 'Estado do retrovisor direito', true, 15),
  ('Exterior', 'Retrovisor esquerdo', 'Estado do retrovisor esquerdo', true, 16),
  ('Exterior', 'Teto', 'Estado do teto do veículo', true, 17),
  ('Exterior', 'Lateral direita', 'Estado da lateral direita', true, 18),
  ('Exterior', 'Lateral esquerda', 'Estado da lateral esquerda', true, 19),
  ('Exterior', 'Pneu dianteiro direito', 'Estado do pneu dianteiro direito', true, 20),
  ('Exterior', 'Pneu dianteiro esquerdo', 'Estado do pneu dianteiro esquerdo', true, 21),
  ('Exterior', 'Pneu traseiro direito', 'Estado do pneu traseiro direito', true, 22),
  
  -- Interior items
  ('Interior', 'Painel de instrumentos', 'Estado do painel de instrumentos', true, 1),
  ('Interior', 'Volante', 'Estado do volante', false, 2),
  ('Interior', 'Bancos dianteiros', 'Estado dos bancos dianteiros', true, 3),
  ('Interior', 'Bancos traseiros', 'Estado dos bancos traseiros', true, 4),
  ('Interior', 'Tapetes', 'Estado dos tapetes', false, 5),
  ('Interior', 'Cintos de segurança', 'Estado dos cintos de segurança', false, 6),
  ('Interior', 'Sistema de som', 'Estado do sistema de som', false, 7),
  ('Interior', 'Ar condicionado', 'Funcionamento do ar condicionado', false, 8),
  ('Interior', 'Vidros elétricos', 'Funcionamento dos vidros elétricos', false, 9),
  ('Interior', 'Travas elétricas', 'Funcionamento das travas elétricas', false, 10),
  
  -- Mecânico items
  ('Mecânico', 'Motor', 'Estado geral do motor', true, 1),
  ('Mecânico', 'Transmissão', 'Estado da transmissão', false, 2),
  ('Mecânico', 'Sistema de freios', 'Estado do sistema de freios', false, 3),
  ('Mecânico', 'Suspensão dianteira', 'Estado da suspensão dianteira', false, 4),
  ('Mecânico', 'Suspensão traseira', 'Estado da suspensão traseira', false, 5),
  ('Mecânico', 'Sistema de direção', 'Estado do sistema de direção', false, 6),
  ('Mecânico', 'Sistema de escape', 'Estado do sistema de escape', false, 7),
  ('Mecânico', 'Radiador', 'Estado do radiador', true, 8),
  ('Mecânico', 'Bateria', 'Estado da bateria', false, 9),
  ('Mecânico', 'Alternador', 'Funcionamento do alternador', false, 10),
  
  -- Elétrico items
  ('Elétrico', 'Sistema de ignição', 'Funcionamento do sistema de ignição', false, 1),
  ('Elétrico', 'Luzes internas', 'Funcionamento das luzes internas', false, 2),
  ('Elétrico', 'Luzes externas', 'Funcionamento das luzes externas', false, 3),
  ('Elétrico', 'Sistema de alarme', 'Funcionamento do sistema de alarme', false, 4),
  ('Elétrico', 'Central elétrica', 'Estado da central elétrica', false, 5),
  
  -- Chassi/Estrutura items
  ('Chassi/Estrutura', 'Chassi principal', 'Estado do chassi principal', true, 1),
  ('Chassi/Estrutura', 'Estrutura da carroceria', 'Estado da estrutura da carroceria', true, 2),
  ('Chassi/Estrutura', 'Solda estrutural', 'Estado das soldas estruturais', true, 3),
  ('Chassi/Estrutura', 'Pontos de ancoragem', 'Estado dos pontos de ancoragem', false, 4)
) AS item(category_name, name, description, requires_photo, display_order)
WHERE dc.name = item.category_name;

-- Insert specific items for motorcycles
INSERT INTO damage_items (category_id, name, description, vehicle_types, requires_photo, display_order)
SELECT 
  dc.id,
  item.name,
  item.description,
  ARRAY['moto']::report_type[],
  item.requires_photo,
  item.display_order
FROM damage_categories dc
CROSS JOIN (VALUES
  ('Específico Moto', 'Tanque de combustível', 'Estado do tanque de combustível', true, 1),
  ('Específico Moto', 'Guidão', 'Estado do guidão', true, 2),
  ('Específico Moto', 'Banco', 'Estado do banco', true, 3),
  ('Específico Moto', 'Escapamento', 'Estado do escapamento', true, 4),
  ('Específico Moto', 'Carenagem', 'Estado da carenagem', true, 5),
  ('Específico Moto', 'Para-lama dianteiro', 'Estado do para-lama dianteiro', true, 6)
) AS item(category_name, name, description, requires_photo, display_order)
WHERE dc.name = item.category_name;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_damage_items_category ON damage_items(category_id);
CREATE INDEX IF NOT EXISTS idx_damage_items_vehicle_types ON damage_items USING GIN(vehicle_types);
CREATE INDEX IF NOT EXISTS idx_vehicle_damage_assessments_vistoria ON vehicle_damage_assessments(vistoria_id);
CREATE INDEX IF NOT EXISTS idx_damage_assessment_items_assessment ON damage_assessment_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_damage_assessment_items_damage_item ON damage_assessment_items(damage_item_id);
CREATE INDEX IF NOT EXISTS idx_assessment_photos_assessment ON assessment_photos(assessment_id);

-- Create function to update assessment counts
CREATE OR REPLACE FUNCTION update_assessment_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vehicle_damage_assessments
  SET 
    total_sim_count = (
      SELECT COUNT(*) FROM damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'SIM'
    ),
    total_nao_count = (
      SELECT COUNT(*) FROM damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'NAO'
    ),
    total_na_count = (
      SELECT COUNT(*) FROM damage_assessment_items 
      WHERE assessment_id = COALESCE(NEW.assessment_id, OLD.assessment_id) 
      AND status = 'NA'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.assessment_id, OLD.assessment_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update counts
CREATE TRIGGER update_assessment_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON damage_assessment_items
  FOR EACH ROW EXECUTE FUNCTION update_assessment_counts();