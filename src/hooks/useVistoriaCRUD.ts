import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface VistoriaData {
  id?: string;
  numero_controle: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  ano_fabricacao?: number;
  ano_modelo?: number;
  cor?: string;
  municipio?: string;
  uf?: string;
  observacoes?: string;
  fotos_frente?: string[];
  fotos_lateral_esquerda?: string[];
  fotos_lateral_direita?: string[];
  fotos_traseira?: string[];
  fotos_chassi?: string[];
  fotos_motor?: string[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export function useVistoriaCRUD() {
  const [vistorias, setVistorias] = useState<VistoriaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVistorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setVistorias(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar vistorias';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createVistoria = useCallback(async (data: Partial<VistoriaData>) => {
    try {
      setActionLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Garantir que numero_controle está presente
      const insertData = {
        ...data,
        created_by: user.id,
        updated_by: user.id,
        numero_controle: data.numero_controle || `CTRL-${Date.now()}`
      };

      const { data: newVistoria, error } = await supabase
        .from('vistorias')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      setVistorias(prev => [newVistoria, ...prev]);
      toast({
        title: "Sucesso",
        description: "Vistoria criada com sucesso!",
      });

      return newVistoria;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar vistoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateVistoria = useCallback(async (id: string, data: Partial<VistoriaData>) => {
    try {
      setActionLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const updateData = {
        ...data,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedVistoria, error } = await supabase
        .from('vistorias')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVistorias(prev => prev.map(v => v.id === id ? updatedVistoria : v));
      toast({
        title: "Sucesso",
        description: "Vistoria atualizada com sucesso!",
      });

      return updatedVistoria;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar vistoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteVistoria = useCallback(async (id: string) => {
    try {
      setActionLoading(true);
      setError(null);

      // Buscar vistoria para remover imagens
      const vistoria = vistorias.find(v => v.id === id);
      if (vistoria) {
        const photoFields = ['fotos_frente', 'fotos_lateral_esquerda', 'fotos_lateral_direita', 'fotos_chassi', 'fotos_traseira', 'fotos_motor'];
        const allPhotos: string[] = [];
        
        photoFields.forEach(field => {
          const photos = vistoria[field as keyof VistoriaData] as string[] | undefined;
          if (Array.isArray(photos)) {
            allPhotos.push(...photos);
          }
        });

        // Remover fotos do storage
        for (const photoUrl of allPhotos) {
          try {
            const url = new URL(photoUrl);
            const pathParts = url.pathname.split('/');
            const filePath = pathParts.slice(-3).join('/');
            await supabase.storage.from('vistoria-fotos').remove([filePath]);
          } catch (photoError) {
            console.error('Erro ao remover foto:', photoError);
          }
        }
      }

      const { error } = await supabase
        .from('vistorias')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVistorias(prev => prev.filter(v => v.id !== id));
      toast({
        title: "Sucesso",
        description: "Vistoria excluída com sucesso!",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir vistoria';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [vistorias]);

  useEffect(() => {
    fetchVistorias();
  }, [fetchVistorias]);

  return {
    vistorias,
    loading,
    actionLoading,
    error,
    createVistoria,
    updateVistoria,
    deleteVistoria,
    refreshVistorias: fetchVistorias,
  };
}