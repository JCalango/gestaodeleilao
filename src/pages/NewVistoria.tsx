import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useVistorias } from '@/contexts/VistoriaContext';
import { VistoriaFormData } from '@/types/vistoria';
import BasicInfoSection from '@/components/forms/BasicInfoSection';
import VehicleInfoSection from '@/components/forms/VehicleInfoSection';
import RestrictionsSection from '@/components/forms/RestrictionsSection';
import OwnerInfoSection from '@/components/forms/OwnerInfoSection';
import DebtInfoSection from '@/components/forms/DebtInfoSection';
import SaleInfoSection from '@/components/forms/SaleInfoSection';
import FinancialInfoSection from '@/components/forms/FinancialInfoSection';
import PhotoUploadSection from '@/components/forms/PhotoUploadSection';

const NewVistoria: React.FC = () => {
  const navigate = useNavigate();
  const { addVistoria } = useVistorias();
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({});
  
  const form = useForm<VistoriaFormData>({
    defaultValues: {
      numero_controle: '',
      data_inspecao: new Date().toISOString(),
      furto_roubo: false,
      restricao_judicial: false,
      restricao_administrativa: false,
      alienacao_fiduciaria: false,
      possui_comunicacao_venda: false,
    },
  });

  const handlePhotosChange = (photos: Record<string, string[]>) => {
    setUploadedPhotos(photos);
  };

  const onSubmit = (data: VistoriaFormData) => {
    // Include photo URLs in the form data
    const formDataWithPhotos = {
      ...data,
      fotos_frente: uploadedPhotos.frente || [],
      fotos_lateral_esquerda: uploadedPhotos.lateral_esquerda || [],
      fotos_lateral_direita: uploadedPhotos.lateral_direita || [],
      fotos_chassi: uploadedPhotos.chassi || [],
      fotos_traseira: uploadedPhotos.traseira || [],
      fotos_motor: uploadedPhotos.motor || []
    };

    console.log('Form submitted with photos:', formDataWithPhotos);
    addVistoria(formDataWithPhotos);
    navigate('/inspections');
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Vistoria</h1>
          <p className="text-slate-600 mt-2">Cadastre uma nova vistoria de veículo</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection control={form.control} />
          <VehicleInfoSection control={form.control} />
          <RestrictionsSection control={form.control} />
          <OwnerInfoSection control={form.control} />
          <DebtInfoSection control={form.control} />
          <SaleInfoSection control={form.control} />
          <FinancialInfoSection control={form.control} />
          <PhotoUploadSection onPhotosChange={handlePhotosChange} />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inspections')}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Vistoria
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewVistoria;
