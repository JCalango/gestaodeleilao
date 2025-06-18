
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Upload, Trash2, Image } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { getSetting, updateSetting, isUpdating } = useSystemSettings();
  const [uploading, setUploading] = useState<string | null>(null);

  const prefeituraLogo = getSetting('prefeitura_logo');
  const smtranLogo = getSetting('smtran_logo');

  const handleFileUpload = async (file: File, settingKey: string) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(settingKey);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${settingKey}_${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data, error } = await supabase.storage
        .from('system-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('system-logos')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        // Delete old logo file if exists
        const oldLogoUrl = getSetting(settingKey);
        if (oldLogoUrl && oldLogoUrl.includes('system-logos')) {
          const oldFileName = oldLogoUrl.split('/').pop();
          if (oldFileName) {
            await supabase.storage
              .from('system-logos')
              .remove([oldFileName]);
          }
        }

        // Update setting with new URL
        await updateSetting(settingKey, publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveLogo = async (settingKey: string) => {
    try {
      const logoUrl = getSetting(settingKey);
      
      // Remove from storage if it's a storage URL
      if (logoUrl && logoUrl.includes('system-logos')) {
        const fileName = logoUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('system-logos')
            .remove([fileName]);
        }
      }

      // Update setting to null
      await updateSetting(settingKey, null);
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem.",
        variant: "destructive",
      });
    }
  };

  const LogoUploadCard = ({ 
    title, 
    description, 
    settingKey, 
    currentLogo 
  }: { 
    title: string; 
    description: string; 
    settingKey: string; 
    currentLogo: string | null; 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLogo ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-slate-50">
              <img
                src={currentLogo}
                alt={title}
                className="max-h-32 mx-auto object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', currentLogo);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById(`${settingKey}-input`)?.click()}
                disabled={uploading === settingKey || isUpdating}
              >
                <Upload className="w-4 h-4 mr-2" />
                Alterar Logo
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRemoveLogo(settingKey)}
                disabled={uploading === settingKey || isUpdating}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Image className="w-12 h-12 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 mb-4">Nenhum logo carregado</p>
              <Button
                variant="outline"
                onClick={() => document.getElementById(`${settingKey}-input`)?.click()}
                disabled={uploading === settingKey || isUpdating}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading === settingKey ? 'Carregando...' : 'Fazer Upload'}
              </Button>
            </div>
          </div>
        )}
        
        <input
          id={`${settingKey}-input`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, settingKey);
          }}
        />
        
        <div className="text-xs text-slate-500">
          Formatos aceitos: PNG, JPG, JPEG. Tamanho máximo: 5MB.
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações do Sistema</h1>
          <p className="text-slate-600 mt-1">
            Gerencie as configurações e logos do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogoUploadCard
          title="Logo da Prefeitura"
          description="Logo que aparecerá nos relatórios e documentos da prefeitura"
          settingKey="prefeitura_logo"
          currentLogo={prefeituraLogo}
        />
        
        <LogoUploadCard
          title="Logo da SMTRAN"
          description="Logo que aparecerá nos relatórios e documentos da SMTRAN"
          settingKey="smtran_logo"
          currentLogo={smtranLogo}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-600">
            <p>• Os logos carregados serão utilizados na geração de PDFs e relatórios.</p>
            <p>• Recomenda-se usar imagens com fundo transparente (PNG) para melhor resultado.</p>
            <p>• As imagens são armazenadas de forma segura no sistema.</p>
            <p>• Apenas usuários administradores podem alterar essas configurações.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
