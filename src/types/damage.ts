
export type VehicleType = 'monobloco' | 'moto' | 'chassi' | 'onibus';
export type DamageStatus = 'SIM' | 'NAO' | 'NA';
export type SeverityCategory = 'M' | 'G';

export interface DamageItem {
  id: string;
  name: string;
  status: DamageStatus;
}

export interface DamageCategory {
  id: string;
  name: string;
  description?: string;
  vehicle_types: VehicleType[];
  display_order: number;
  is_active: boolean;
}

export interface DamageItemDefinition {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  vehicle_types: VehicleType[];
  requires_photo: boolean;
  severity_levels: SeverityCategory[];
  display_order: number;
  is_active: boolean;
}

export interface VehicleDamageAssessment {
  id: string;
  vistoria_id: string;
  vehicle_type: VehicleType;
  assessor_name?: string;
  assessor_registration?: string;
  assessment_date: string;
  vehicle_classification?: string;
  total_sim_count: number;
  total_nao_count: number;
  total_na_count: number;
  observations?: string;
  is_completed: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DamageAssessmentFormData {
  vistoria_id: string;
  vehicle_type: VehicleType;
  assessor_name?: string;
  assessor_registration?: string;
  assessment_date: string;
  vehicle_classification?: string;
  observations?: string;
  is_completed: boolean;
}

export interface DamageAssessmentItemFormData {
  damage_item_id: string;
  status: DamageStatus;
  severity?: SeverityCategory;
  notes?: string;
  requires_repair: boolean;
  estimated_cost?: number;
}

export interface SimpleDamageAssessment {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  lote: string;
  vehicle_type: VehicleType;
  classification: string;
  inspector: string;
  registration: string;
  date: string;
  observations: string;
  damage_items: DamageItem[];
  total_sim_count: number;
  total_nao_count: number;
  total_na_count: number;
  created_at: string;
  updated_at: string;
}
