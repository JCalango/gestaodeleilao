
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
import { toast } from '@/hooks/use-toast';

const NewVistoria: React.FC = () => {
  const navigate = useNavigate();
  const { addVistoria } = useVistorias();
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VistoriaFormData>({
    defaultValues: {
      numero_controle: '',
      data_inspecao: new Date().toISOString(),
      furto_roubo: false,
      restricao_judicial: false,
      restricao_administrativa: false,
      alienacao_fiduciaria: false,
      possui_comunicacao_venda: false,
      motor_alterado: 'nao',
    },
  });

  const handlePhotosChange = (photos: Record<string, string[]>) => {
    console.log('Photos updated in NewVistoria:', photos);
    setUploadedPhotos(photos);
  };

  const onSubmit = async (data: VistoriaFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Garantir que as URLs das fotos sejam incluídas nos dados corretos
      const formDataWithPhotos: VistoriaFormData = {
        ...data,
        fotos_frente: uploadedPhotos.frente || [],
        fotos_lateral_esquerda: uploadedPhotos.lateral_esquerda || [],
        fotos_lateral_direita: uploadedPhotos.lateral_direita || [],
        fotos_chassi: uploadedPhotos.chassi || [],
        fotos_traseira: uploadedPhotos.traseira || [],
        fotos_motor: uploadedPhotos.motor || []
      };

      console.log('Submitting vistoria with photos:', formDataWithPhotos);
      
      // Verificar se as URLs estão sendo passadas corretamente
      const photoFields = [
        'fotos_frente', 'fotos_lateral_esquerda', 'fotos_lateral_direita',
        'fotos_chassi', 'fotos_traseira', 'fotos_motor'
      ];
      
      photoFields.forEach(field => {
        const photos = formDataWithPhotos[field as keyof VistoriaFormData] as string[];
        if (photos && photos.length > 0) {
          console.log(`${field}:`, photos);
        }
      });

      await addVistoria(formDataWithPhotos);
      
      toast({
        title: "Sucesso",
        description: "Vistoria criada com sucesso!",
      });
      
      navigate('/inspections');
    } catch (error) {
      console.error('Erro ao criar vistoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar vistoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/inspections')}
          className="flex items-center gap-2"
          disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Vistoria'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewVistoria;
