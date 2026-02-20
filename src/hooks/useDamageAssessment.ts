
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  VehicleDamageAssessment, 
  SimpleDamageAssessment, 
  VehicleType, 
  DamageCategory,
  DamageItemDefinition,
  DamageAssessmentFormData,
  DamageAssessmentItemFormData
} from '@/types/damage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Original hook for backward compatibility
export const useDamageAssessment = () => {
  const [assessments, setAssessments] = useState<SimpleDamageAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createAssessment = async (assessment: Omit<SimpleDamageAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const newAssessment: SimpleDamageAssessment = {
        ...assessment,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Store in localStorage for now
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      existingAssessments.push(newAssessment);
      localStorage.setItem('damageAssessments', JSON.stringify(existingAssessments));

      setAssessments(prev => [...prev, newAssessment]);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos criada com sucesso!",
      });

      return newAssessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssessment = async (id: string, updates: Partial<SimpleDamageAssessment>) => {
    setIsLoading(true);
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      const updatedAssessments = existingAssessments.map((assessment: SimpleDamageAssessment) =>
        assessment.id === id 
          ? { ...assessment, ...updates, updated_at: new Date().toISOString() }
          : assessment
      );
      
      localStorage.setItem('damageAssessments', JSON.stringify(updatedAssessments));
      setAssessments(updatedAssessments);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAssessment = async (id: string) => {
    setIsLoading(true);
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      const filteredAssessments = existingAssessments.filter((assessment: SimpleDamageAssessment) => assessment.id !== id);
      
      localStorage.setItem('damageAssessments', JSON.stringify(filteredAssessments));
      setAssessments(filteredAssessments);
      
      toast({
        title: "Sucesso",
        description: "Avaliação de danos removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação de danos.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadAssessments = () => {
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('damageAssessments') || '[]');
      setAssessments(existingAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAssessments([]);
    }
  };

  return {
    assessments,
    isLoading,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    loadAssessments,
  };
};

// New hooks for the advanced components
export const useDamageCategories = (vehicleType: VehicleType) => {
  return useQuery({
    queryKey: ['damage-categories', vehicleType],
    queryFn: async (): Promise<DamageCategory[]> => {
      const { data, error } = await supabase
        .from('damage_categories')
        .select('*')
        .contains('vehicle_types', [vehicleType])
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        vehicle_types: item.vehicle_types as VehicleType[],
        display_order: item.display_order,
        is_active: item.is_active
      }));
    },
  });
};

export const useDamageItems = (vehicleType: VehicleType) => {
  return useQuery({
    queryKey: ['damage-items', vehicleType],
    queryFn: async (): Promise<DamageItemDefinition[]> => {
      const { data, error } = await supabase
        .from('damage_items')
        .select('*')
        .contains('vehicle_types', [vehicleType])
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        category_id: item.category_id,
        name: item.name,
        description: item.description,
        vehicle_types: item.vehicle_types as VehicleType[],
        requires_photo: item.requires_photo,
        severity_levels: item.severity_levels as ('M' | 'G')[],
        display_order: item.display_order,
        is_active: item.is_active
      }));
    },
  });
};

export const useVehicleDamageAssessments = (vistoriaId?: string) => {
  return useQuery({
    queryKey: ['vehicle-damage-assessments', vistoriaId],
    queryFn: async (): Promise<VehicleDamageAssessment[]> => {
      let query = supabase
        .from('vehicle_damage_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (vistoriaId) {
        query = query.eq('vistoria_id', vistoriaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        vistoria_id: item.vistoria_id,
        vehicle_type: item.vehicle_type as VehicleType,
        assessor_name: item.assessor_name,
        assessor_registration: item.assessor_registration,
        assessment_date: item.assessment_date,
        vehicle_classification: item.vehicle_classification,
        total_sim_count: item.total_sim_count,
        total_nao_count: item.total_nao_count,
        total_na_count: item.total_na_count,
        observations: item.observations,
        is_completed: item.is_completed,
        created_by: item.created_by,
        updated_by: item.updated_by,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    },
  });
};

export const useCreateDamageAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DamageAssessmentFormData): Promise<VehicleDamageAssessment> => {
      const user = await supabase.auth.getUser();
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .insert({
          ...data,
          created_by: user.data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: result.id,
        vistoria_id: result.vistoria_id,
        vehicle_type: result.vehicle_type as VehicleType,
        assessor_name: result.assessor_name,
        assessor_registration: result.assessor_registration,
        assessment_date: result.assessment_date,
        vehicle_classification: result.vehicle_classification,
        total_sim_count: result.total_sim_count,
        total_nao_count: result.total_nao_count,
        total_na_count: result.total_na_count,
        observations: result.observations,
        is_completed: result.is_completed,
        created_by: result.created_by,
        updated_by: result.updated_by,
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de danos criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação de danos.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDamageAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DamageAssessmentFormData> }): Promise<VehicleDamageAssessment> => {
      const user = await supabase.auth.getUser();
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .update({
          ...data,
          updated_by: user.data.user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: result.id,
        vistoria_id: result.vistoria_id,
        vehicle_type: result.vehicle_type as VehicleType,
        assessor_name: result.assessor_name,
        assessor_registration: result.assessor_registration,
        assessment_date: result.assessment_date,
        vehicle_classification: result.vehicle_classification,
        total_sim_count: result.total_sim_count,
        total_nao_count: result.total_nao_count,
        total_na_count: result.total_na_count,
        observations: result.observations,
        is_completed: result.is_completed,
        created_by: result.created_by,
        updated_by: result.updated_by,
        created_at: result.created_at,
        updated_at: result.updated_at
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de danos atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação de danos.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDamageAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('vehicle_damage_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de danos removida com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação de danos.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateAssessmentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      assessmentId, 
      items 
    }: { 
      assessmentId: string; 
      items: DamageAssessmentItemFormData[] 
    }): Promise<void> => {
      // First, delete existing items for this assessment
      await (supabase as any)
        .from('damage_assessment_items')
        .delete()
        .eq('assessment_id', assessmentId);

      // Then insert new items
      const { error } = await (supabase as any)
        .from('damage_assessment_items')
        .insert(
          items.map(item => ({
            assessment_id: assessmentId,
            ...item,
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Itens da avaliação salvos com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating assessment items:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar itens da avaliação.",
        variant: "destructive",
      });
    },
  });
};
