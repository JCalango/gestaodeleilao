
export type VehicleType = 'monobloco' | 'moto' | 'chassi' | 'onibus';
export type DamageStatus = 'SIM' | 'NAO' | 'NA';
export type SeverityCategory = 'M' | 'G';

export interface DamageItem {
  id: string;
  name: string;
  status: DamageStatus;
}

export interface VehicleDamageAssessment {
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

export interface SimpleDamageAssessment {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  lote: string;
  vehicle_type: VehicleType; // Changed from string to VehicleType
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
