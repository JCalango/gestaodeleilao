import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useVistorias } from '@/contexts/VistoriaContext';
import DamageAssessmentForm from '@/components/damage/DamageAssessmentForm';
import DamageAssessmentList from '@/components/damage/DamageAssessmentList';
import { VehicleDamageAssessment } from '@/types/damage';

const DamageAssessment: React.FC = () => {
  const { vistoriaId } = useParams<{ vistoriaId: string }>();
  const navigate = useNavigate();
  const { getVistoriaById } = useVistorias();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<VehicleDamageAssessment | null>(null);

  const vistoria = vistoriaId ? getVistoriaById(vistoriaId) : null;

  if (!vistoria) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/inspections')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Vistoria não encontrada</h1>
            <p className="text-slate-600">A vistoria solicitada não foi encontrada.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateNew = () => {
    setEditingAssessment(null);
    setShowForm(true);
  };

  const handleEdit = (assessment: VehicleDamageAssessment) => {
    setEditingAssessment(assessment);
    setShowForm(true);
  };

  const handleSave = (assessment: VehicleDamageAssessment) => {
    setShowForm(false);
    setEditingAssessment(null);
  };

  const handleView = (assessment: VehicleDamageAssessment) => {
    // TODO: Implement view mode
    console.log('View assessment:', assessment);
  };

  // Determine vehicle type from vistoria data or default to 'monobloco'
  const getVehicleType = (): 'monobloco' | 'moto' | 'chassi' | 'onibus' => {
    // You can add logic here to determine vehicle type from vistoria data
    // For now, defaulting to 'monobloco'
    return 'monobloco';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/inspections')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">Avaliação de Avarias</h1>
          <p className="text-slate-600">
            Vistoria: {vistoria.placa} - {vistoria.marca} {vistoria.modelo}
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        )}
      </div>

      {showForm ? (
        <DamageAssessmentForm
          vistoriaId={vistoriaId!}
          vehicleType={getVehicleType()}
          existingAssessment={editingAssessment || undefined}
          onSave={handleSave}
        />
      ) : (
        <DamageAssessmentList
          vistoriaId={vistoriaId}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}
    </div>
  );
};

export default DamageAssessment;