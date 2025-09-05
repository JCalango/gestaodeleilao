import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVistorias } from '@/contexts/VistoriaContext';
import { Button } from '@/components/ui/button';

const InspectionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getVistoriaById } = useVistorias();
  const navigate = useNavigate();

  const vistoria = id ? getVistoriaById(id) : null;

  if (!vistoria) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold mb-2">Vistoria não encontrada</h2>
        <Button onClick={() => navigate('/inspections')}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Vistoria</h1>
      {/* Adicione aqui o formulário de edição */}
      <div className="mb-4">
        <p><strong>Placa:</strong> {vistoria.placa}</p>
        <p><strong>Controle:</strong> {vistoria.numero_controle}</p>
        {/* Adicione outros campos conforme necessário */}
      </div>
      <Button variant="outline" onClick={() => navigate('/inspections')}>Cancelar</Button>
    </div>
  );
};

export default InspectionEdit;
