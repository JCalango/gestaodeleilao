
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditVistoria: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getVistoriaById, updateVistoria } = useVistorias();
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialPhotosLoaded, setInitialPhotosLoaded] = useState(false);
  
  const vistoria = id ? getVistoriaById(id) : null;
  
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
      tipo_veiculo: '',
    },
  });

  useEffect(() => {
    if (vistoria && !initialPhotosLoaded) {
      console.log('Loading vistoria data:', vistoria);
      
      // Preenche o formulário com os dados existentes
      form.reset({
        numero_controle: vistoria.numero_controle || '',
        data_inspecao: vistoria.data_inspecao || new Date().toISOString(),
        placa: vistoria.placa || '',
        marca: vistoria.marca || '',
        modelo: vistoria.modelo || '',
        renavam: vistoria.renavam || '',
        cor: vistoria.cor || '',
        ano_fabricacao: vistoria.ano_fabricacao || undefined,
        ano_modelo: vistoria.ano_modelo || undefined,
        municipio: vistoria.municipio || '',
        uf: vistoria.uf || '',
        tipo_combustivel: vistoria.tipo_combustivel || '',
        categoria: vistoria.categoria || '',
        tipo_veiculo: vistoria.tipo_veiculo || '',
        numero_motor: vistoria.numero_motor || '',
        motor_alterado: vistoria.motor_alterado || 'nao',
        condicao_motor: vistoria.condicao_motor || '',
        numero_chassi: vistoria.numero_chassi || '',
        condicao_chassi: vistoria.condicao_chassi || '',
        furto_roubo: vistoria.furto_roubo || false,
        restricao_judicial: vistoria.restricao_judicial || false,
        restricao_administrativa: vistoria.restricao_administrativa || false,
        alienacao_fiduciaria: vistoria.alienacao_fiduciaria || false,
        observacoes: vistoria.observacoes || '',
        nome_proprietario: vistoria.nome_proprietario || '',
        cpf_cnpj_proprietario: vistoria.cpf_cnpj_proprietario || '',
        endereco_proprietario: vistoria.endereco_proprietario || '',
        numero_casa_proprietario: vistoria.numero_casa_proprietario || '',
        complemento_proprietario: vistoria.complemento_proprietario || '',
        informacoes_complementares_proprietario: vistoria.informacoes_complementares_proprietario || '',
        cep_proprietario: vistoria.cep_proprietario || '',
        cidade_proprietario: vistoria.cidade_proprietario || '',
        bairro_proprietario: vistoria.bairro_proprietario || '',
        ipva: vistoria.ipva || '',
        licenciamento: vistoria.licenciamento || '',
        infracoes_transito: vistoria.infracoes_transito || '',
        data_entrada_patio: vistoria.data_entrada_patio || null,
        debito_patio: vistoria.debito_patio || undefined,
        dados_remocao: vistoria.dados_remocao || '',
        possui_comunicacao_venda: vistoria.possui_comunicacao_venda || false,
        nome_possuidor: vistoria.nome_possuidor || '',
        cpf_cnpj_possuidor: vistoria.cpf_cnpj_possuidor || '',
        endereco_possuidor: vistoria.endereco_possuidor || '',
        informacoes_complementares_possuidor: vistoria.informacoes_complementares_possuidor || '',
        cep_possuidor: vistoria.cep_possuidor || '',
        cidade_possuidor: vistoria.cidade_possuidor || '',
        bairro_possuidor: vistoria.bairro_possuidor || '',
        nome_financeira: vistoria.nome_financeira || '',
        cnpj_financeira: vistoria.cnpj_financeira || '',
        endereco_financeira: vistoria.endereco_financeira || '',
        numero_endereco_financeira: vistoria.numero_endereco_financeira || '',
        bairro_financeira: vistoria.bairro_financeira || '',
        complemento_financeira: vistoria.complemento_financeira || '',
        cep_financeira: vistoria.cep_financeira || '',
        cidade_financeira: vistoria.cidade_financeira || '',
      });

      // Configura as fotos existentes
      const existingPhotos = {
        frente: vistoria.fotos_frente || [],
        lateral_esquerda: vistoria.fotos_lateral_esquerda || [],
        lateral_direita: vistoria.fotos_lateral_direita || [],
        chassi: vistoria.fotos_chassi || [],
        traseira: vistoria.fotos_traseira || [],
        motor: vistoria.fotos_motor || []
      };
      
      console.log('Setting existing photos:', existingPhotos);
      setUploadedPhotos(existingPhotos);
      setInitialPhotosLoaded(true);
    }
  }, [vistoria, form, initialPhotosLoaded]);

  const handlePhotosChange = (photos: Record<string, string[]>) => {
    console.log('Photos updated in EditVistoria:', photos);
    setUploadedPhotos(photos);
  };

  const onSubmit = async (data: VistoriaFormData) => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID da vistoria não encontrado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Garantir que as URLs das fotos atualizadas sejam incluídas
      const formDataWithPhotos: Partial<VistoriaFormData> = {
        ...data,
        fotos_frente: uploadedPhotos.frente || [],
        fotos_lateral_esquerda: uploadedPhotos.lateral_esquerda || [],
        fotos_lateral_direita: uploadedPhotos.lateral_direita || [],
        fotos_chassi: uploadedPhotos.chassi || [],
        fotos_traseira: uploadedPhotos.traseira || [],
        fotos_motor: uploadedPhotos.motor || []
      };

      console.log('Updating vistoria with photos:', formDataWithPhotos);
      
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

      await updateVistoria(id, formDataWithPhotos);
      navigate('/inspections');
    } catch (error) {
      console.error('Erro ao atualizar vistoria:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar vistoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!vistoria) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Vistoria não encontrada</h2>
          <p className="text-slate-600 mb-4">A vistoria solicitada não foi encontrada.</p>
          <Button onClick={() => navigate('/inspections')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/inspections')}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editar Vistoria</h1>
          <p className="text-slate-600 mt-2">
            Editando vistoria: {vistoria.numero_controle}
          </p>
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
          <PhotoUploadSection 
            onPhotosChange={handlePhotosChange} 
            initialPhotos={uploadedPhotos}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inspections')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditVistoria;
