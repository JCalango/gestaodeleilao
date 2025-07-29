import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vistoria, VistoriaFormData } from '@/types/vistoria';

interface VistoriaContextType {
  vistorias: Vistoria[];
  isLoading: boolean;
  error?: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const fetchVistorias = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Buscando vistorias...');
      
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vistorias:', error);
        setError('Erro ao carregar vistorias');
        toast({
          title: "Erro",
          description: "Erro ao carregar vistorias",
          variant: "destructive",
        });
        return;
      }

      setVistorias(data || []);
      console.log('Vistorias carregadas:', data?.length || 0);
    } catch (error) {
      console.error('Error:', error);
      setError('Erro ao carregar vistorias');
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
        description: "Vistoria excluída com sucesso!",
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

  // Buscar dados inicialmente
  useEffect(() => {
    fetchVistorias();
  }, []);

  // Escutar eventos de refresh automático
  useEffect(() => {
    const handleRefresh = () => {
      console.log('Evento de refresh recebido - atualizando vistorias...');
      fetchVistorias();
    };

    window.addEventListener('refresh-app-data', handleRefresh);
    
    return () => {
      window.removeEventListener('refresh-app-data', handleRefresh);
    };
  }, []);

  const value: VistoriaContextType = {
    vistorias,
    isLoading,
    error,
    addVistoria,
    updateVistoria,
    deleteVistoria,
    getVistoriaById,
    refreshVistorias: fetchVistorias,
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
