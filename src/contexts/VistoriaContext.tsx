
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vistoria, VistoriaFormData } from '@/types/vistoria';

interface VistoriaContextType {
  vistorias: Vistoria[];
  isLoading: boolean;
  addVistoria: (vistoria: VistoriaFormData) => Promise<void>;
  updateVistoria: (id: string, vistoria: Partial<Vistoria>) => Promise<void>;
  deleteVistoria: (id: string) => Promise<void>;
  getVistoriaById: (id: string) => Vistoria | undefined;
  refreshVistorias: () => Promise<void>;
}

const VistoriaContext = createContext<VistoriaContextType | undefined>(undefined);

export const VistoriaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVistorias = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vistorias:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar vistorias",
          variant: "destructive",
        });
        return;
      }

      setVistorias(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar vistorias",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addVistoria = async (vistoriaData: VistoriaFormData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar uma vistoria",
          variant: "destructive",
        });
        return;
      }

      // Preparar os dados garantindo que as URLs das fotos sejam incluídas
      const dataToInsert = {
        ...vistoriaData,
        created_by: user.id,
        updated_by: user.id,
        // Garantir que os arrays de fotos sejam incluídos corretamente
        fotos_frente: vistoriaData.fotos_frente || [],
        fotos_lateral_esquerda: vistoriaData.fotos_lateral_esquerda || [],
        fotos_lateral_direita: vistoriaData.fotos_lateral_direita || [],
        fotos_chassi: vistoriaData.fotos_chassi || [],
        fotos_traseira: vistoriaData.fotos_traseira || [],
        fotos_motor: vistoriaData.fotos_motor || []
      };

      console.log('Inserting vistoria data:', dataToInsert);

      const { data, error } = await supabase
        .from('vistorias')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Error adding vistoria:', error);
        toast({
          title: "Erro",
          description: `Erro ao salvar vistoria: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Vistoria saved successfully:', data);
      setVistorias(prev => [data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Vistoria salva com sucesso!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar vistoria",
        variant: "destructive",
      });
    }
  };

  const updateVistoria = async (id: string, vistoriaData: Partial<Vistoria>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para atualizar uma vistoria",
          variant: "destructive",
        });
        return;
      }

      // Preparar os dados garantindo que as URLs das fotos sejam incluídas
      const dataToUpdate = {
        ...vistoriaData,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
        // Garantir que os arrays de fotos sejam incluídos corretamente
        fotos_frente: vistoriaData.fotos_frente || [],
        fotos_lateral_esquerda: vistoriaData.fotos_lateral_esquerda || [],
        fotos_lateral_direita: vistoriaData.fotos_lateral_direita || [],
        fotos_chassi: vistoriaData.fotos_chassi || [],
        fotos_traseira: vistoriaData.fotos_traseira || [],
        fotos_motor: vistoriaData.fotos_motor || []
      };

      console.log('Updating vistoria data:', dataToUpdate);

      const { data, error } = await supabase
        .from('vistorias')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating vistoria:', error);
        toast({
          title: "Erro",
          description: `Erro ao atualizar vistoria: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Vistoria updated successfully:', data);
      setVistorias(prev => prev.map(v => v.id === id ? data : v));
      
      toast({
        title: "Sucesso",
        description: "Vistoria atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar vistoria",
        variant: "destructive",
      });
    }
  };

  const deleteVistoria = async (id: string) => {
    try {
      // Primeiro, obter a vistoria para acessar as URLs das fotos
      const vistoria = vistorias.find(v => v.id === id);
      
      if (vistoria) {
        // Coletar todas as URLs de fotos para remover do storage
        const allPhotoUrls: string[] = [];
        const photoFields = [
          'fotos_frente', 'fotos_lateral_esquerda', 'fotos_lateral_direita',
          'fotos_chassi', 'fotos_traseira', 'fotos_motor'
        ];

        photoFields.forEach(field => {
          const photos = vistoria[field as keyof typeof vistoria];
          if (Array.isArray(photos)) {
            allPhotoUrls.push(...photos);
          }
        });

        // Remover fotos do storage antes de deletar o registro
        if (allPhotoUrls.length > 0) {
          const removePhotoPromises = allPhotoUrls.map(async (photoUrl) => {
            try {
              const url = new URL(photoUrl);
              const pathParts = url.pathname.split('/');
              const filePath = pathParts.slice(-3).join('/');

              const { error } = await supabase.storage
                .from('vistoria-fotos')
                .remove([filePath]);

              if (error) {
                console.error('Error removing photo from storage:', error);
              }
            } catch (error) {
              console.error('Error processing photo URL:', error);
            }
          });

          // Executar todas as remoções em paralelo
          await Promise.allSettled(removePhotoPromises);
        }
      }

      // Agora deletar o registro da vistoria
      const { error } = await supabase
        .from('vistorias')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting vistoria:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir vistoria",
          variant: "destructive",
        });
        return;
      }

      setVistorias(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Sucesso",
        description: "Vistoria e imagens excluídas com sucesso!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir vistoria",
        variant: "destructive",
      });
    }
  };

  const getVistoriaById = (id: string): Vistoria | undefined => {
    return vistorias.find(v => v.id === id);
  };

  const refreshVistorias = async () => {
    await fetchVistorias();
  };

  useEffect(() => {
    fetchVistorias();
  }, []);

  const value: VistoriaContextType = {
    vistorias,
    isLoading,
    addVistoria,
    updateVistoria,
    deleteVistoria,
    getVistoriaById,
    refreshVistorias,
  };

  return (
    <VistoriaContext.Provider value={value}>
      {children}
    </VistoriaContext.Provider>
  );
};

export const useVistorias = (): VistoriaContextType => {
  const context = useContext(VistoriaContext);
  if (!context) {
    throw new Error('useVistorias must be used within a VistoriaProvider');
  }
  return context;
};
