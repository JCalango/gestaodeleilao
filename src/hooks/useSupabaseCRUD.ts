import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export interface CRUDState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  actionLoading: boolean;
}

export interface CRUDOptions<T extends keyof Database['public']['Tables']> {
  tableName: T;
  orderBy?: { column: string; ascending?: boolean };
  select?: string;
  realtime?: boolean;
}

export interface CRUDHookReturn<T> {
  state: CRUDState<T>;
  operations: {
    fetchAll: () => Promise<void>;
    create: (data: Partial<T>) => Promise<T | null>;
    update: (id: string, data: Partial<T>) => Promise<T | null>;
    delete: (id: string) => Promise<boolean>;
    findById: (id: string) => T | undefined;
  };
  utils: {
    refresh: () => Promise<void>;
    clearError: () => void;
    setOptimisticUpdate: (updater: (prev: T[]) => T[]) => void;
  };
}

export function useSupabaseCRUD<
  TTable extends keyof Database['public']['Tables'],
  T extends Database['public']['Tables'][TTable]['Row']
>(
  options: CRUDOptions<TTable>
): CRUDHookReturn<T> {
  const { tableName, orderBy = { column: 'created_at', ascending: false }, select = '*', realtime = false } = options;

  const [state, setState] = useState<CRUDState<T>>({
    data: [],
    loading: true,
    error: null,
    actionLoading: false,
  });

  // Função para fetch de dados com tratamento robusto de erros
  const fetchAll = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      let query = supabase
        .from(tableName)
        .select(select);

      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setState(prev => ({
        ...prev,
        data: (data || []) as T[],
        loading: false,
        error: null,
      }));

    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));

      toast({
        title: "Erro ao carregar dados",
        description: `Não foi possível carregar os dados de ${tableName}. Tente novamente.`,
        variant: "destructive",
      });
    }
  }, [tableName, select, orderBy]);

  // Operação CREATE com tratamento de usuário autenticado
  const create = useCallback(async (
    data: Partial<T>
  ): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, actionLoading: true, error: null }));

      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar logado para realizar esta ação');
      }

      // Preparar dados com informações de auditoria
      const dataToInsert = {
        ...data,
        created_by: user.id,
        updated_by: user.id,
      } as any;

      const { data: newRecord, error } = await supabase
        .from(tableName)
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualização otimista
      setState(prev => ({
        ...prev,
        data: [newRecord as T, ...prev.data],
        actionLoading: false,
        error: null,
      }));

      toast({
        title: "Sucesso",
        description: "Registro criado com sucesso!",
      });

      return newRecord;

    } catch (error) {
      console.error(`Error creating ${tableName}:`, error);
      setState(prev => ({
        ...prev,
        actionLoading: false,
        error: error as Error,
      }));

      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar registro';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [tableName]);

  // Operação UPDATE
  const update = useCallback(async (
    id: string,
    data: Partial<T>
  ): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, actionLoading: true, error: null }));

      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Você precisa estar logado para realizar esta ação');
      }

      // Preparar dados com informações de auditoria
      const dataToUpdate = {
        ...data,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      } as any;

      const { data: updatedRecord, error } = await supabase
        .from(tableName)
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualização otimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(item => (item as any).id === id ? updatedRecord as T : item),
        actionLoading: false,
        error: null,
      }));

      toast({
        title: "Sucesso",
        description: "Registro atualizado com sucesso!",
      });

      return updatedRecord;

    } catch (error) {
      console.error(`Error updating ${tableName}:`, error);
      setState(prev => ({
        ...prev,
        actionLoading: false,
        error: error as Error,
      }));

      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar registro';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [tableName]);

  // Operação DELETE
  const deleteRecord = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, actionLoading: true, error: null }));

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Atualização otimista
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => (item as any).id !== id),
        actionLoading: false,
        error: null,
      }));

      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso!",
      });

      return true;

    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      setState(prev => ({
        ...prev,
        actionLoading: false,
        error: error as Error,
      }));

      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir registro';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  }, [tableName]);

  // Função para encontrar por ID
  const findById = useCallback((id: string): T | undefined => {
    return state.data.find(item => (item as any).id === id);
  }, [state.data]);

  // Função para refresh manual
  const refresh = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Função para atualização otimista
  const setOptimisticUpdate = useCallback((updater: (prev: T[]) => T[]) => {
    setState(prev => ({
      ...prev,
      data: updater(prev.data),
    }));
  }, []);

  // Configurar realtime se habilitado
  useEffect(() => {
    if (!realtime) return;

    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setState(prev => ({
                ...prev,
                data: [payload.new as T, ...prev.data]
              }));
              break;
            case 'UPDATE':
              setState(prev => ({
                ...prev,
                data: prev.data.map(item => 
                  (item as any).id === payload.new.id ? payload.new as T : item
                )
              }));
              break;
            case 'DELETE':
              setState(prev => ({
                ...prev,
                data: prev.data.filter(item => (item as any).id !== payload.old.id)
              }));
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, realtime]);

  // Fetch inicial
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    state,
    operations: {
      fetchAll,
      create,
      update,
      delete: deleteRecord,
      findById,
    },
    utils: {
      refresh,
      clearError,
      setOptimisticUpdate,
    },
  };
}