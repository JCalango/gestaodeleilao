export interface DamageCategory {
  id: string;
  name: string;
  description?: string;
  vehicle_types: ('monobloco' | 'moto' | 'chassi' | 'onibus')[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DamageItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  vehicle_types: ('monobloco' | 'moto' | 'chassi' | 'onibus')[];
  requires_photo: boolean;
  severity_levels: ('M' | 'G')[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: DamageCategory;
}

export interface VehicleDamageAssessment {
  id: string;
  vistoria_id: string;
  vehicle_type: 'monobloco' | 'moto' | 'chassi' | 'onibus';
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

export interface DamageAssessmentItem {
  id: string;
  assessment_id: string;
  damage_item_id: string;
  status: 'SIM' | 'NAO' | 'NA';
  severity?: 'M' | 'G';
  notes?: string;
  requires_repair: boolean;
  estimated_cost?: number;
  created_at: string;
  updated_at: string;
  damage_item?: DamageItem;
}

export interface AssessmentPhoto {
  id: string;
  assessment_id: string;
  assessment_item_id?: string;
  photo_url: string;
  photo_type: string;
  description?: string;
  uploaded_by?: string;
  created_at: string;
}

export type DamageAssessmentFormData = Omit<VehicleDamageAssessment, 'id' | 'created_at' | 'updated_at' | 'total_sim_count' | 'total_nao_count' | 'total_na_count'>;

export interface DamageAssessmentItemFormData {
  damage_item_id: string;
  status: 'SIM' | 'NAO' | 'NA';
  severity?: 'M' | 'G';
  notes?: string;
  requires_repair: boolean;
  estimated_cost?: number;
}