
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VehicleInspection, InspectionFormData } from '../types/inspection';

interface InspectionContextType {
  inspections: VehicleInspection[];
  addInspection: (inspection: InspectionFormData) => void;
  updateInspection: (id: string, inspection: Partial<VehicleInspection>) => void;
  deleteInspection: (id: string) => void;
  getInspectionById: (id: string) => VehicleInspection | undefined;
  searchInspections: (query: string) => VehicleInspection[];
  filterInspections: (filters: any) => VehicleInspection[];
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

// Mock data for demonstration
const mockInspections: VehicleInspection[] = [
  {
    id: '1',
    inspectionDate: '2024-06-10',
    licensePlate: 'ABC-1234',
    brand: 'Toyota',
    model: 'Corolla',
    renavam: '12345678901',
    color: 'Branco',
    controlNumber: 'CTL001',
    manufacturingYear: 2020,
    modelYear: 2020,
    city: 'São Paulo',
    state: 'SP',
    vehicleType: 'Automóvel',
    fuelType: 'Flex',
    category: 'Particular',
    engineNumber: 'ENG123456',
    engineCondition: 'good',
    chassisNumber: 'CHS789012',
    chassisCondition: 'good',
    stolenOrRobbed: false,
    judicialRestrictions: false,
    administrativeRestrictions: false,
    financialLien: true,
    observations: 'Veículo em bom estado geral',
    owner: {
      name: 'João Silva',
      cpf: '123.456.789-00',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99999-9999',
      email: 'joao@email.com'
    },
    ipvaStatus: 'up_to_date',
    licensingStatus: 'up_to_date',
    yardEntryDate: '2024-06-08',
    trafficViolations: [],
    photos: [],
    status: 'pending',
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z'
  },
  {
    id: '2',
    inspectionDate: '2024-06-11',
    licensePlate: 'XYZ-5678',
    brand: 'Honda',
    model: 'Civic',
    renavam: '98765432109',
    color: 'Preto',
    controlNumber: 'CTL002',
    manufacturingYear: 2019,
    modelYear: 2019,
    city: 'Rio de Janeiro',
    state: 'RJ',
    vehicleType: 'Automóvel',
    fuelType: 'Gasolina',
    category: 'Particular',
    engineNumber: 'ENG654321',
    engineCondition: 'excellent',
    chassisNumber: 'CHS210987',
    chassisCondition: 'excellent',
    stolenOrRobbed: false,
    judicialRestrictions: true,
    administrativeRestrictions: false,
    financialLien: false,
    observations: 'Restrição judicial pendente',
    owner: {
      name: 'Maria Santos',
      cpf: '987.654.321-00',
      address: 'Av. Copacabana, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phone: '(21) 88888-8888',
      email: 'maria@email.com'
    },
    ipvaStatus: 'pending',
    licensingStatus: 'overdue',
    yardEntryDate: '2024-06-09',
    trafficViolations: [
      {
        id: 'v1',
        date: '2024-05-15',
        description: 'Excesso de velocidade',
        amount: 195.23,
        status: 'pending'
      }
    ],
    photos: [],
    status: 'approved',
    createdAt: '2024-06-11T14:30:00Z',
    updatedAt: '2024-06-11T14:30:00Z'
  }
];

export const InspectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inspections, setInspections] = useState<VehicleInspection[]>(mockInspections);

  const addInspection = (inspectionData: InspectionFormData) => {
    const newInspection: VehicleInspection = {
      ...inspectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInspections(prev => [...prev, newInspection]);
  };

  const updateInspection = (id: string, updatedData: Partial<VehicleInspection>) => {
    setInspections(prev =>
      prev.map(inspection =>
        inspection.id === id
          ? { ...inspection, ...updatedData, updatedAt: new Date().toISOString() }
          : inspection
      )
    );
  };

  const deleteInspection = (id: string) => {
    setInspections(prev => prev.filter(inspection => inspection.id !== id));
  };

  const getInspectionById = (id: string) => {
    return inspections.find(inspection => inspection.id === id);
  };

  const searchInspections = (query: string) => {
    if (!query.trim()) return inspections;
    
    return inspections.filter(inspection =>
      inspection.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
      inspection.brand.toLowerCase().includes(query.toLowerCase()) ||
      inspection.model.toLowerCase().includes(query.toLowerCase()) ||
      inspection.owner.name.toLowerCase().includes(query.toLowerCase()) ||
      inspection.city.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterInspections = (filters: any) => {
    return inspections.filter(inspection => {
      if (filters.status && inspection.status !== filters.status) return false;
      if (filters.state && inspection.state !== filters.state) return false;
      if (filters.hasRestrictions !== undefined) {
        const hasRestrictions = inspection.judicialRestrictions || 
                               inspection.administrativeRestrictions || 
                               inspection.stolenOrRobbed;
        if (filters.hasRestrictions !== hasRestrictions) return false;
      }
      return true;
    });
  };

  return (
    <InspectionContext.Provider value={{
      inspections,
      addInspection,
      updateInspection,
      deleteInspection,
      getInspectionById,
      searchInspections,
      filterInspections,
    }}>
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspections = () => {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspections must be used within an InspectionProvider');
  }
  return context;
};
