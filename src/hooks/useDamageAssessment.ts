
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
      return data || [];
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
      return data || [];
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
      return data || [];
    },
  });
};

export const useCreateDamageAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DamageAssessmentFormData): Promise<VehicleDamageAssessment> => {
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .insert({
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
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
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .update({
          ...data,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
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
      await supabase
        .from('damage_assessment_items')
        .delete()
        .eq('assessment_id', assessmentId);

      // Then insert new items
      const { error } = await supabase
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
