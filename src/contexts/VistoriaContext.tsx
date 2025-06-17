import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Vistoria, VistoriaFormData } from '@/types/vistoria';
import { toast } from '@/hooks/use-toast';

interface VistoriaContextType {
  vistorias: Vistoria[];
  isLoading: boolean;
  error: Error | null;
  addVistoria: (vistoria: VistoriaFormData) => void;
  updateVistoria: (id: string, vistoria: Partial<Vistoria>) => void;
  deleteVistoria: (id: string) => void;
  getVistoriaById: (id: string) => Vistoria | undefined;
}

const VistoriaContext = createContext<VistoriaContextType | undefined>(undefined);

export const VistoriaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: vistorias = [], isLoading, error } = useQuery({
    queryKey: ['vistorias'],
    queryFn: async () => {
      console.log('Fetching vistorias...');
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vistorias:', error);
        throw error;
      }

      console.log('Vistorias fetched:', data);
      return data as Vistoria[];
    },
    enabled: !!user,
  });

  const addVistoriaMutation = useMutation({
    mutationFn: async (vistoriaData: VistoriaFormData) => {
      console.log('Adding vistoria:', vistoriaData);
      
      // Log user activity using the new function
      try {
        const { error: activityError } = await supabase
          .from('user_activities')
          .insert([{
            user_id: user?.id,
            activity_type: 'VISTORIA_CREATED',
            description: `Nova vistoria criada - Placa: ${vistoriaData.placa || 'N/A'}`,
            metadata: {
              numero_controle: vistoriaData.numero_controle,
              placa: vistoriaData.placa,
              marca: vistoriaData.marca,
              modelo: vistoriaData.modelo
            }
          }]);
        
        if (activityError) {
          console.error('Error logging activity:', activityError);
        }
      } catch (activityError) {
        console.error('Error logging activity:', activityError);
      }

      const { data, error } = await supabase
        .from('vistorias')
        .insert([{
          ...vistoriaData,
          created_by: user?.id,
          updated_by: user?.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding vistoria:', error);
        throw error;
      }

      console.log('Vistoria added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      toast({
        title: "Sucesso",
        description: "Vistoria cadastrada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar vistoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateVistoriaMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vistoria> }) => {
      console.log('Updating vistoria:', id, updates);
      const { data, error } = await supabase
        .from('vistorias')
        .update({
          ...updates,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vistoria:', error);
        throw error;
      }

      console.log('Vistoria updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      toast({
        title: "Sucesso",
        description: "Vistoria atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar vistoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteVistoriaMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting vistoria:', id);
      const { error } = await supabase
        .from('vistorias')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting vistoria:', error);
        throw error;
      }

      console.log('Vistoria deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      toast({
        title: "Sucesso",
        description: "Vistoria excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir vistoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const addVistoria = (vistoria: VistoriaFormData) => {
    addVistoriaMutation.mutate(vistoria);
  };

  const updateVistoria = (id: string, updates: Partial<Vistoria>) => {
    updateVistoriaMutation.mutate({ id, updates });
  };

  const deleteVistoria = (id: string) => {
    deleteVistoriaMutation.mutate(id);
  };

  const getVistoriaById = (id: string) => {
    return vistorias?.find(vistoria => vistoria.id === id);
  };

  return (
    <VistoriaContext.Provider value={{
      vistorias: vistorias || [],
      isLoading,
      error: error as Error | null,
      addVistoria,
      updateVistoria,
      deleteVistoria,
      getVistoriaById,
    }}>
      {children}
    </VistoriaContext.Provider>
  );
};

export const useVistorias = () => {
  const context = useContext(VistoriaContext);
  if (context === undefined) {
    throw new Error('useVistorias must be used within a VistoriaProvider');
  }
  return context;
};
