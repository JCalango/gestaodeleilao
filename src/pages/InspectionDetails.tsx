
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useVistorias } from '@/contexts/VistoriaContext';
import { useAuth } from '@/contexts/AuthContext';
import VehicleInfoCard from '@/components/inspection/VehicleInfoCard';
import OwnerInfoCard from '@/components/inspection/OwnerInfoCard';
import DebtsInfoCard from '@/components/inspection/DebtsInfoCard';
import RestrictionsCard from '@/components/inspection/RestrictionsCard';
import PhotosCard from '@/components/inspection/PhotosCard';
import { generateInspectionPDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVistoriaById } = useVistorias();
  const { user, isAdmin } = useAuth();

  const vistoria = id ? getVistoriaById(id) : null;

  const handleGeneratePDF = async () => {
    if (vistoria) {
      try {
        await generateInspectionPDF(vistoria);
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        toast({
          title: "Erro",
          description: "Erro ao gerar o PDF. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/edit-vistoria/${id}`);
    }
  };

  // Verificar se o usuário pode editar a vistoria
  const canEdit = vistoria && user && (
    isAdmin() || vistoria.created_by === user.id
  );

  if (!vistoria) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Vistoria não encontrada</h2>
          <p className="text-slate-600 mb-4">A vistoria solicitada não foi encontrada.</p>
          <Button onClick={() => navigate('/inspections')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-3xl font-bold text-slate-900">
              Vistoria - {vistoria.placa || 'Sem placa'}
            </h1>
            <p className="text-slate-600 mt-1">
              Controle: {vistoria.numero_controle}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {canEdit && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </Button>
          )}
          <Button 
            onClick={handleGeneratePDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Status e Data */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-slate-600">Data da Inspeção</p>
                <p className="font-medium">
                  {vistoria.data_inspecao 
                    ? new Date(vistoria.data_inspecao).toLocaleDateString('pt-BR')
                    : 'Não informada'
                  }
                </p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <p className="text-sm text-slate-600">Criada em</p>
                <p className="font-medium">
                  {vistoria.created_at 
                    ? new Date(vistoria.created_at).toLocaleDateString('pt-BR')
                    : 'Não informada'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {vistoria.restricao_judicial && (
                <Badge variant="destructive">Restrição Judicial</Badge>
              )}
              {vistoria.restricao_administrativa && (
                <Badge variant="destructive">Restrição Administrativa</Badge>
              )}
              {vistoria.furto_roubo && (
                <Badge variant="destructive">Furto/Roubo</Badge>
              )}
              {!vistoria.restricao_judicial && 
               !vistoria.restricao_administrativa && 
               !vistoria.furto_roubo && (
                <Badge variant="secondary">Sem restrições</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VehicleInfoCard vistoria={vistoria} />
        <OwnerInfoCard vistoria={vistoria} />
        <DebtsInfoCard vistoria={vistoria} />
        <RestrictionsCard vistoria={vistoria} />
      </div>

      {/* Fotos */}
      <PhotosCard vistoria={vistoria} />

      {/* Observações */}
      {vistoria.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{vistoria.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InspectionDetails;
