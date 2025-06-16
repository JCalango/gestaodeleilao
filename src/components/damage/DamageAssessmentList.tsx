import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus, FileText, AlertTriangle } from 'lucide-react';
import { useVehicleDamageAssessments, useDeleteDamageAssessment } from '@/hooks/useDamageAssessment';
import { VehicleDamageAssessment } from '@/types/damage';

interface DamageAssessmentListProps {
  vistoriaId?: string;
  onCreateNew?: () => void;
  onEdit?: (assessment: VehicleDamageAssessment) => void;
  onView?: (assessment: VehicleDamageAssessment) => void;
}

const DamageAssessmentList: React.FC<DamageAssessmentListProps> = ({
  vistoriaId,
  onCreateNew,
  onEdit,
  onView
}) => {
  const { data: assessments = [], isLoading } = useVehicleDamageAssessments(vistoriaId);
  const deleteAssessmentMutation = useDeleteDamageAssessment();

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação de avarias?')) {
      await deleteAssessmentMutation.mutateAsync(id);
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    const labels = {
      monobloco: 'Automóvel',
      moto: 'Motocicleta',
      chassi: 'Chassi',
      onibus: 'Ônibus'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (assessment: VehicleDamageAssessment) => {
    if (assessment.is_completed) {
      return <Badge variant="default">Concluída</Badge>;
    }
    return <Badge variant="secondary">Rascunho</Badge>;
  };

  const getDamagesSummary = (assessment: VehicleDamageAssessment) => {
    const total = assessment.total_sim_count + assessment.total_nao_count + assessment.total_na_count;
    if (total === 0) return 'Não avaliado';
    
    return (
      <div className="flex gap-2">
        {assessment.total_sim_count > 0 && (
          <Badge variant="destructive" className="text-xs">
            {assessment.total_sim_count} avarias
          </Badge>
        )}
        {assessment.total_nao_count > 0 && (
          <Badge variant="secondary" className="text-xs">
            {assessment.total_nao_count} ok
          </Badge>
        )}
        {assessment.total_na_count > 0 && (
          <Badge variant="outline" className="text-xs">
            {assessment.total_na_count} n/a
          </Badge>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Carregando avaliações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Avaliações de Avarias
            </CardTitle>
            <CardDescription>
              Gerencie as avaliações de avarias dos veículos
            </CardDescription>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Nenhuma avaliação encontrada
            </h3>
            <p className="text-slate-600 mb-4">
              {vistoriaId 
                ? 'Esta vistoria ainda não possui avaliações de avarias.'
                : 'Não há avaliações de avarias cadastradas no sistema.'
              }
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira avaliação
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Veículo</TableHead>
                <TableHead>Vistoriador</TableHead>
                <TableHead>Data da Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resumo de Avarias</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {getVehicleTypeLabel(assessment.vehicle_type)}
                      </p>
                      {assessment.vehicle_classification && (
                        <p className="text-sm text-slate-600">
                          {assessment.vehicle_classification}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {assessment.assessor_name || 'Não informado'}
                      </p>
                      {assessment.assessor_registration && (
                        <p className="text-sm text-slate-600">
                          Mat: {assessment.assessor_registration}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {new Date(assessment.assessment_date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(assessment)}
                  </TableCell>
                  
                  <TableCell>
                    {getDamagesSummary(assessment)}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(assessment)}
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(assessment)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(assessment.id)}
                        disabled={deleteAssessmentMutation.isPending}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DamageAssessmentList;