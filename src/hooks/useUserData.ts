import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface UserDashboardData {
  profile: {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'member';
    created_at: string;
    updated_at: string;
  };
  recent_vistorias: any[];
  recent_assessments: any[];
  loaded_at: number;
}

export interface UserDataState {
  data: UserDashboardData | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

export interface UserDataHook {
  data: UserDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  isStale: (maxAgeMinutes?: number) => boolean;
}

/**
 * Hook customizado para carregar dados do usuário automaticamente após login
 * 
 * @param options - Opções de configuração
 * @param options.enableAutoRefetch - Se deve recarregar dados automaticamente (padrão: true)
 * @param options.cacheMinutes - Tempo de cache em minutos (padrão: 5)
 * @param options.retryAttempts - Tentativas de retry em caso de erro (padrão: 3)
 * @param options.showToastOnError - Se deve mostrar toast em caso de erro (padrão: true)
 * 
 * @returns Objeto com dados do usuário, estados de loading/error e funções utilitárias
 */
export function useUserData(options: {
  enableAutoRefetch?: boolean;
  cacheMinutes?: number;
  retryAttempts?: number;
  showToastOnError?: boolean;
} = {}): UserDataHook {
  const {
    enableAutoRefetch = true,
    cacheMinutes = 5,
    retryAttempts = 3,
    showToastOnError = true
  } = options;

  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<UserDataState>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  });

  // Controles internos
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Função principal para buscar dados do usuário
  const fetchUserData = useCallback(async (forceRefresh = false): Promise<void> => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Verificar se o usuário está autenticado
    if (!user?.id) {
      setState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: null,
        lastFetch: null
      }));
      return;
    }

    // Verificar cache se não for refresh forçado
    if (!forceRefresh && state.data && state.lastFetch) {
      const ageMinutes = (Date.now() - state.lastFetch.getTime()) / 1000 / 60;
      if (ageMinutes < cacheMinutes) {
        console.log('Using cached user data');
        return;
      }
    }

    // Criar novo AbortController para esta requisição
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      console.log('Fetching user dashboard data for user:', user.id);

      // Chamar a função do banco que retorna todos os dados do usuário
      const { data, error } = await supabase.rpc('get_user_dashboard_data' as any, {
        _user_id: user.id
      });

      // Verificar se o componente ainda está montado
      if (!isMountedRef.current || abortController.signal.aborted) {
        return;
      }

      if (error) {
        throw new Error(error.message || 'Erro ao carregar dados do usuário');
      }

      // Validar estrutura dos dados retornados
      if (!data || typeof data !== 'object') {
        throw new Error('Dados do usuário inválidos retornados do servidor');
      }

      const userData: UserDashboardData = {
        profile: data?.profile || {},
        recent_vistorias: data?.recent_vistorias || [],
        recent_assessments: data?.recent_assessments || [],
        loaded_at: data?.loaded_at || Date.now() / 1000
      };

      setState(prev => ({
        ...prev,
        data: userData,
        loading: false,
        error: null,
        lastFetch: new Date()
      }));

      // Reset contador de retry após sucesso
      retryCountRef.current = 0;

      console.log('User data loaded successfully:', userData);

    } catch (error: any) {
      // Verificar se não foi cancelado
      if (error.name === 'AbortError' || !isMountedRef.current) {
        return;
      }

      console.error('Error fetching user data:', error);

      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro desconhecido ao carregar dados do usuário';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Mostrar toast de erro se habilitado
      if (showToastOnError) {
        toast({
          title: "Erro ao carregar dados",
          description: errorMessage,
          variant: "destructive",
        });
      }

      // Tentar novamente se houver tentativas disponíveis
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;
        console.log(`Retrying user data fetch (attempt ${retryCountRef.current}/${retryAttempts})`);
        
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchUserData(forceRefresh);
          }
        }, Math.pow(2, retryCountRef.current) * 1000); // Backoff exponencial
      }
    }
  }, [user?.id, state.data, state.lastFetch, cacheMinutes, retryAttempts, showToastOnError]);

  // Função para refetch manual
  const refetch = useCallback(async (): Promise<void> => {
    await fetchUserData(true);
  }, [fetchUserData]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Função para verificar se os dados estão desatualizados
  const isStale = useCallback((maxAgeMinutes = cacheMinutes): boolean => {
    if (!state.lastFetch) return true;
    const ageMinutes = (Date.now() - state.lastFetch.getTime()) / 1000 / 60;
    return ageMinutes > maxAgeMinutes;
  }, [state.lastFetch, cacheMinutes]);

  // Effect principal - carregar dados quando usuário fizer login
  useEffect(() => {
    isMountedRef.current = true;

    // Não fazer nada se ainda estiver carregando a autenticação
    if (authLoading) {
      return;
    }

    // Se o usuário não está autenticado, limpar dados
    if (!user) {
      setState({
        data: null,
        loading: false,
        error: null,
        lastFetch: null
      });
      retryCountRef.current = 0;
      return;
    }

    // Se autoRefetch está habilitado e não há dados ou estão desatualizados
    if (enableAutoRefetch && (!state.data || isStale())) {
      console.log('Auto-fetching user data after login');
      fetchUserData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, authLoading, enableAutoRefetch, fetchUserData, state.data, isStale]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cancelar requisições pendentes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isMountedRef.current = false;
    };
  }, []);

  // Effect para escutar notificações em tempo real (opcional)
  useEffect(() => {
    if (!user?.id) return;

    // Escutar notificações de refresh de dados do usuário
    const channel = supabase
      .channel('user-data-refresh')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_activities',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('User activity detected, refreshing data:', payload);
        // Refresh dados após atividade do usuário
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchUserData(true);
          }
        }, 1000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchUserData]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
    clearError,
    isStale
  };
}