import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { VistoriaFormData } from '@/types/vistoria';

export const useVistoriaQuery = (id: string) => {
  return useQuery({
    queryKey: ['vistoria', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('vistorias')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data as VistoriaFormData;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};
