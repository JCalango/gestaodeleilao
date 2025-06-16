import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, Camera, AlertTriangle } from 'lucide-react';
import { 
  useDamageCategories, 
  useDamageItems, 
  useCreateDamageAssessment, 
  useCreateAssessmentItem,
  useUpdateDamageAssessment 
} from '@/hooks/useDamageAssessment';
import { DamageAssessmentFormData, DamageAssessmentItemFormData, VehicleDamageAssessment } from '@/types/damage';
import { cn } from '@/lib/utils';

interface DamageAssessmentFormProps {
  vistoriaId: string;
  vehicleType: 'monobloco' | 'moto' | 'chassi' | 'onibus';
  existingAssessment?: VehicleDamageAssessment;
  onSave?: (assessment: VehicleDamageAssessment) => void;
}

const DamageAssessmentForm: React.FC<DamageAssessmentFormProps> = ({
  vistoriaId,
  vehicleType,
  existingAssessment,
  onSave
}) => {
  const [assessmentItems, setAssessmentItems] = useState<Record<string, DamageAssessmentItemFormData>>({});
  const [currentAssessment, setCurrentAssessment] = useState<VehicleDamageAssessment | null>(existingAssessment || null);

  const { data: categories = [], isLoading: categoriesLoading } = useDamageCategories(vehicleType);
  const { data: damageItems = [], isLoading: itemsLoading } = useDamageItems(vehicleType);
  
  const createAssessmentMutation = useCreateDamageAssessment();
  const updateAssessmentMutation = useUpdateDamageAssessment();
  const createItemsMutation = useCreateAssessmentItem();

  const form = useForm<DamageAssessmentFormData>({
    defaultValues: {
      vistoria_id: vistoriaId,
      vehicle_type: vehicleType,
      assessor_name: existingAssessment?.assessor_name || '',
      assessor_registration: existingAssessment?.assessor_registration || '',
      assessment_date: existingAssessment?.assessment_date || new Date().toISOString(),
      vehicle_classification: existingAssessment?.vehicle_classification || '',
      observations: existingAssessment?.observations || '',
      is_completed: existingAssessment?.is_completed || false,
    },
  });

  const handleItemChange = (itemId: string, field: keyof DamageAssessmentItemFormData, value: any) => {
    setAssessmentItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        damage_item_id: itemId,
        [field]: value,
        requires_repair: field === 'status' && value === 'SIM' ? true : (prev[itemId]?.requires_repair || false),
      }
    }));
  };

  const getItemStatus = (itemId: string): 'SIM' | 'NAO' | 'NA' => {
    return assessmentItems[itemId]?.status || 'NA';
  };

  const getStatusCounts = () => {
    const items = Object.values(assessmentItems);
    return {
      sim: items.filter(item => item.status === 'SIM').length,
      nao: items.filter(item => item.status === 'NAO').length,
      na: items.filter(item => item.status === 'NA').length,
    };
  };

  const onSubmit = async (data: DamageAssessmentFormData) => {
    try {
      let assessment = currentAssessment;

      if (!assessment) {
        // Create new assessment
        assessment = await createAssessmentMutation.mutateAsync(data);
        setCurrentAssessment(assessment);
      } else {
        // Update existing assessment
        assessment = await updateAssessmentMutation.mutateAsync({
          id: assessment.id,
          data: data
        });
      }

      // Save assessment items
      const itemsToSave = Object.values(assessmentItems).filter(item => 
        item.status && item.status !== 'NA'
      );

      if (itemsToSave.length > 0) {
        await createItemsMutation.mutateAsync({
          assessmentId: assessment.id,
          items: itemsToSave
        });
      }

      onSave?.(assessment);
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const statusCounts = getStatusCounts();

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando formulário de avaliação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Avaliação de Avarias - {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
          </CardTitle>
          <CardDescription>
            Avalie cada item do veículo marcando como SIM (com avaria), NÃO (sem avaria) ou NA (não se aplica)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Assessment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assessor_name">Nome do Vistoriador</Label>
                <Input
                  id="assessor_name"
                  {...form.register('assessor_name')}
                  placeholder="Nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assessor_registration">Matrícula</Label>
                <Input
                  id="assessor_registration"
                  {...form.register('assessor_registration')}
                  placeholder="Número da matrícula"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_classification">Classificação do Veículo</Label>
                <Input
                  id="vehicle_classification"
                  {...form.register('vehicle_classification')}
                  placeholder="Ex: Leve, Pesado, Especial"
                />
              </div>
            </div>

            {/* Status Summary */}
            <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">SIM: {statusCounts.sim}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">NÃO: {statusCounts.nao}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">N/A: {statusCounts.na}</Badge>
              </div>
            </div>

            {/* Damage Assessment Items */}
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => {
                const categoryItems = damageItems.filter(item => item.category_id === category.id);
                
                if (categoryItems.length === 0) return null;

                return (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full mr-4">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex gap-2">
                          {categoryItems.some(item => getItemStatus(item.id) === 'SIM') && (
                            <Badge variant="destructive" className="text-xs">
                              {categoryItems.filter(item => getItemStatus(item.id) === 'SIM').length} com avaria
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900">{item.name}</h4>
                                {item.description && (
                                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                )}
                              </div>
                              {item.requires_photo && (
                                <Button type="button" variant="outline" size="sm">
                                  <Camera className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">Status da Avaria</Label>
                                <RadioGroup
                                  value={getItemStatus(item.id)}
                                  onValueChange={(value) => handleItemChange(item.id, 'status', value as 'SIM' | 'NAO' | 'NA')}
                                  className="flex gap-6 mt-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="SIM" id={`${item.id}-sim`} />
                                    <Label htmlFor={`${item.id}-sim`} className="text-red-600 font-medium">SIM</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NAO" id={`${item.id}-nao`} />
                                    <Label htmlFor={`${item.id}-nao`} className="text-green-600 font-medium">NÃO</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="NA" id={`${item.id}-na`} />
                                    <Label htmlFor={`${item.id}-na`} className="text-slate-600 font-medium">N/A</Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {getItemStatus(item.id) === 'SIM' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-red-50 rounded-lg">
                                  {item.severity_levels.length > 0 && (
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Gravidade</Label>
                                      <Select
                                        value={assessmentItems[item.id]?.severity || ''}
                                        onValueChange={(value) => handleItemChange(item.id, 'severity', value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="M">Média (M)</SelectItem>
                                          <SelectItem value="G">Grave (G)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Custo Estimado (R$)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0,00"
                                      value={assessmentItems[item.id]?.estimated_cost || ''}
                                      onChange={(e) => handleItemChange(item.id, 'estimated_cost', parseFloat(e.target.value) || 0)}
                                    />
                                  </div>

                                  <div className="md:col-span-2 space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${item.id}-repair`}
                                        checked={assessmentItems[item.id]?.requires_repair || false}
                                        onCheckedChange={(checked) => handleItemChange(item.id, 'requires_repair', checked)}
                                      />
                                      <Label htmlFor={`${item.id}-repair`} className="text-sm">
                                        Requer reparo imediato
                                      </Label>
                                    </div>
                                  </div>

                                  <div className="md:col-span-2 space-y-2">
                                    <Label className="text-sm font-medium">Observações</Label>
                                    <Textarea
                                      placeholder="Descreva detalhes da avaria..."
                                      value={assessmentItems[item.id]?.notes || ''}
                                      onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* General Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observações Gerais</Label>
              <Textarea
                id="observations"
                {...form.register('observations')}
                placeholder="Observações gerais sobre a vistoria..."
                rows={4}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue('is_completed', false)}
              >
                Salvar Rascunho
              </Button>
              <Button
                type="submit"
                onClick={() => form.setValue('is_completed', true)}
                disabled={createAssessmentMutation.isPending || createItemsMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {createAssessmentMutation.isPending || createItemsMutation.isPending 
                  ? 'Salvando...' 
                  : 'Finalizar Avaliação'
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DamageAssessmentForm;