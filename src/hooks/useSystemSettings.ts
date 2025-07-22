
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data as SystemSetting[];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string | null }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Sucesso",
        description: "Configuração atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Settings update error:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração.",
        variant: "destructive",
      });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async ({ type, file }: { type: 'prefeitura' | 'smtran'; file: File }) => {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('system-logos')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('system-logos')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');

      // Update system settings with the new logo URL
      const settingKey = type === 'prefeitura' ? 'prefeitura_logo' : 'smtran_logo';
      
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: settingKey, 
          setting_value: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
    onError: (error) => {
      console.error('Logo upload error:', error);
      throw error;
    },
  });

  const getSetting = (key: string): string | null => {
    const setting = settings.find(s => s.setting_key === key);
    return setting?.setting_value || null;
  };

  return {
    settings,
    isLoading,
    updateSetting: (key: string, value: string | null) => 
      updateSettingMutation.mutate({ key, value }),
    uploadLogo: (type: 'prefeitura' | 'smtran', file: File) =>
      uploadLogoMutation.mutate({ type, file }),
    isUpdating: updateSettingMutation.isPending || uploadLogoMutation.isPending,
    getSetting,
  };
};
