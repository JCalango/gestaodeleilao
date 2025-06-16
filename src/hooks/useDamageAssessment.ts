import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  DamageCategory, 
  DamageItem, 
  VehicleDamageAssessment, 
  DamageAssessmentItem,
  DamageAssessmentFormData,
  DamageAssessmentItemFormData
} from '@/types/damage';

export const useDamageCategories = (vehicleType?: string) => {
  return useQuery({
    queryKey: ['damage-categories', vehicleType],
    queryFn: async () => {
      let query = supabase
        .from('damage_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (vehicleType) {
        query = query.contains('vehicle_types', [vehicleType]);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching damage categories:', error);
        throw error;
      }

      return data as DamageCategory[];
    },
  });
};

export const useDamageItems = (vehicleType?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ['damage-items', vehicleType, categoryId],
    queryFn: async () => {
      let query = supabase
        .from('damage_items')
        .select(`
          *,
          category:damage_categories(*)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (vehicleType) {
        query = query.contains('vehicle_types', [vehicleType]);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching damage items:', error);
        throw error;
      }

      return data as DamageItem[];
    },
  });
};

export const useVehicleDamageAssessments = (vistoriaId?: string) => {
  return useQuery({
    queryKey: ['vehicle-damage-assessments', vistoriaId],
    queryFn: async () => {
      let query = supabase
        .from('vehicle_damage_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (vistoriaId) {
        query = query.eq('vistoria_id', vistoriaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching damage assessments:', error);
        throw error;
      }

      return data as VehicleDamageAssessment[];
    },
  });
};

export const useDamageAssessmentItems = (assessmentId: string) => {
  return useQuery({
    queryKey: ['damage-assessment-items', assessmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('damage_assessment_items')
        .select(`
          *,
          damage_item:damage_items(
            *,
            category:damage_categories(*)
          )
        `)
        .eq('assessment_id', assessmentId)
        .order('created_at');

      if (error) {
        console.error('Error fetching assessment items:', error);
        throw error;
      }

      return data as DamageAssessmentItem[];
    },
    enabled: !!assessmentId,
  });
};

export const useCreateDamageAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DamageAssessmentFormData) => {
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .insert([{
          ...data,
          created_by: user?.id,
          updated_by: user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating damage assessment:', error);
        throw error;
      }

      return result as VehicleDamageAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de avarias criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Create assessment error:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação de avarias. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDamageAssessment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VehicleDamageAssessment> }) => {
      const { data: result, error } = await supabase
        .from('vehicle_damage_assessments')
        .update({
          ...data,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating damage assessment:', error);
        throw error;
      }

      return result as VehicleDamageAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de avarias atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Update assessment error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar avaliação de avarias. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useCreateAssessmentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assessmentId, items }: { assessmentId: string; items: DamageAssessmentItemFormData[] }) => {
      const itemsToInsert = items.map(item => ({
        ...item,
        assessment_id: assessmentId,
      }));

      const { data, error } = await supabase
        .from('damage_assessment_items')
        .upsert(itemsToInsert, { 
          onConflict: 'assessment_id,damage_item_id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Error creating assessment items:', error);
        throw error;
      }

      return data as DamageAssessmentItem[];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['damage-assessment-items', variables.assessmentId] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Itens de avaliação salvos com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Create assessment items error:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar itens de avaliação. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDamageAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicle_damage_assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting damage assessment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-damage-assessments'] });
      toast({
        title: "Sucesso",
        description: "Avaliação de avarias excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Delete assessment error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir avaliação de avarias. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};