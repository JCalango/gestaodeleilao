import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getPhotoPublicUrl } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useMemo } from 'react';

// Tipos para a vistoria
export interface Vistoria {
  id: string;
  numero_controle: string;
  placa?: string;
  marca?: string;
  modelo?: string;
  ano_fabricacao?: number;
  ano_modelo?: number;
  cor?: string;
  chassi?: string;
  renavam?: string;
  categoria?: string;
  tipo_veiculo?: string;
  tipo_combustivel?: string;
  nome_proprietario?: string;
  cpf_cnpj_proprietario?: string;
  endereco_proprietario?: string;
  numero_casa_proprietario?: string;
  complemento_proprietario?: string;
  bairro_proprietario?: string;
  cidade_proprietario?: string;
  cep_proprietario?: string;
  nome_possuidor?: string;
  cpf_cnpj_possuidor?: string;
  endereco_possuidor?: string;
  bairro_possuidor?: string;
  cidade_possuidor?: string;
  cep_possuidor?: string;
  nome_financeira?: string;
  cnpj_financeira?: string;
  endereco_financeira?: string;
  numero_endereco_financeira?: string;
  complemento_financeira?: string;
  bairro_financeira?: string;
  cidade_financeira?: string;
  cep_financeira?: string;
  restricao_judicial?: boolean;
  restricao_administrativa?: boolean;
  furto_roubo?: boolean;
  alienacao_fiduciaria?: boolean;
  ipva?: string;
  licenciamento?: string;
  infracoes_transito?: string;
  debito_patio?: number;
  condicao_chassi?: string;
  condicao_motor?: string;
  motor_alterado?: string;
  observacoes?: string;
  fotos_frente?: string[];
  fotos_lateral_esquerda?: string[];
  fotos_lateral_direita?: string[];
  fotos_traseira?: string[];
  fotos_chassi?: string[];
  fotos_motor?: string[];
  data_inspecao?: string;
  data_entrada_patio?: string;
  municipio?: string;
  uf?: string;
  dados_remocao?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Buscar uma vistoria por ID
export const useVistoria = (id: string | undefined) => {
  return useQuery({
    queryKey: ['vistoria', id],
    queryFn: async (): Promise<Vistoria | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Erro ao buscar vistoria:', error);
        if (error.code === 'PGRST116') {
          throw new Error('Vistoria não encontrada');
        }
        throw new Error(`Erro ao carregar vistoria: ${error.message}`);
      }
      return data;
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error.message.includes('não encontrada')) return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
  // cacheTime removido (não suportado no React Query v5+)
  });
};

// Buscar todas as vistorias
export const useVistorias = (filters?: {
  placa?: string;
  numero_controle?: string;
  created_by?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['vistorias', filters],
    queryFn: async () => {
      let query = supabase
        .from('vistorias')
        .select('*')
        .order('created_at', { ascending: false });
      if (filters?.placa) query = query.ilike('placa', `%${filters.placa}%`);
      if (filters?.numero_controle) query = query.ilike('numero_controle', `%${filters.numero_controle}%`);
      if (filters?.created_by) query = query.eq('created_by', filters.created_by);
      if (filters?.limit) query = query.limit(filters.limit);
      if (filters?.offset) query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1);
      const { data, error } = await query;
      if (error) {
        console.error('Erro ao buscar vistorias:', error);
        throw new Error(`Erro ao carregar vistorias: ${error.message}`);
      }
      return data || [];
    },
    staleTime: 2 * 60 * 1000,
  // cacheTime removido (não suportado no React Query v5+)
  });
};

// Criar uma nova vistoria
export const useCreateVistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vistoriaData: Partial<Vistoria> & { numero_controle: string }) => {
      // Garante que numero_controle está presente
      if (!vistoriaData.numero_controle) {
        throw new Error('O campo numero_controle é obrigatório para criar uma vistoria.');
      }
      const { data, error } = await supabase
        .from('vistorias')
        .insert([vistoriaData])
        .select()
        .single();
      if (error) {
        console.error('Erro ao criar vistoria:', error);
        throw new Error(`Erro ao criar vistoria: ${error.message}`);
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      queryClient.setQueryData(['vistoria', data.id], data);
      toast({
        title: "Sucesso",
        description: "Vistoria criada com sucesso!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Atualizar uma vistoria
export const useUpdateVistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vistoria> }) => {
      const { data: updatedData, error } = await supabase
        .from('vistorias')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Erro ao atualizar vistoria:', error);
        throw new Error(`Erro ao atualizar vistoria: ${error.message}`);
      }
      return updatedData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      queryClient.setQueryData(['vistoria', variables.id], data);
      toast({
        title: "Sucesso",
        description: "Vistoria atualizada com sucesso!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Deletar uma vistoria
export const useDeleteVistoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vistorias')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Erro ao deletar vistoria:', error);
        throw new Error(`Erro ao deletar vistoria: ${error.message}`);
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: ['vistoria', id] });
      queryClient.invalidateQueries({ queryKey: ['vistorias'] });
      toast({
        title: "Sucesso",
        description: "Vistoria deletada com sucesso!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Processar URLs de fotos
export const usePhotoUrls = (vistoria: Vistoria | null) => {
  return useMemo(() => {
    if (!vistoria) return {};
    const photoFields = [
      'fotos_frente', 
      'fotos_lateral_esquerda', 
      'fotos_lateral_direita',
      'fotos_chassi', 
      'fotos_traseira', 
      'fotos_motor'
    ] as const;
    const urls: Record<string, string[]> = {};
    photoFields.forEach(field => {
      const paths = vistoria[field] || [];
      const subpasta = field.replace('fotos_', '');
      urls[subpasta] = paths
        .filter(path => path && typeof path === 'string')
        .map(path => {
          if (path.startsWith('http')) return path;
          const cleanPath = path.startsWith(subpasta + '/') ? path : `${subpasta}/${path}`;
          return getPhotoPublicUrl(cleanPath);
        })
        .filter(url => url !== '');
    });
    return urls;
  }, [vistoria]);
};
