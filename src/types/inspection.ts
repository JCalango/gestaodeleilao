
export interface VehicleOwner {
  name: string;
  cpf: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export interface FinancialInstitution {
  name: string;
  cnpj: string;
  contact: string;
}

export interface VehiclePhoto {
  id: string;
  type: 'front' | 'back' | 'left' | 'right' | 'chassis' | 'engine';
  url: string;
  description?: string;
}

export interface TrafficViolation {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'contested';
}

export interface VehicleInspection {
  id: string;
  inspectionDate: string;
  licensePlate: string;
  brand: string;
  model: string;
  renavam: string;
  color: string;
  controlNumber: string;
  manufacturingYear: number;
  modelYear: number;
  city: string;
  state: string;
  vehicleType: string;
  fuelType: string;
  category: string;
  engineNumber: string;
  engineCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  chassisNumber: string;
  chassisCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  stolenOrRobbed: boolean;
  judicialRestrictions: boolean;
  administrativeRestrictions: boolean;
  financialLien: boolean;
  observations: string;
  owner: VehicleOwner;
  possessor?: VehicleOwner;
  financialInstitution?: FinancialInstitution;
  ipvaStatus: 'up_to_date' | 'pending' | 'overdue';
  licensingStatus: 'up_to_date' | 'pending' | 'overdue';
  yardEntryDate: string;
  trafficViolations: TrafficViolation[];
  photos: VehiclePhoto[];
  status: 'pending' | 'approved' | 'rejected' | 'auctioned';
  createdAt: string;
  updatedAt: string;
}

export type InspectionFormData = Omit<VehicleInspection, 'id' | 'createdAt' | 'updatedAt'>;
