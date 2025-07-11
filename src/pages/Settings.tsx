
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Upload, Trash2, Image, FileImage, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { getSetting, updateSetting, isUpdating } = useSystemSettings();
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<string | null>(null);

  const prefeituraLogo = getSetting('prefeitura_logo');
  const smtranLogo = getSetting('smtran_logo');

  const validateFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return false;
    }

    // Increased file size limit to 20MB
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 20MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File, settingKey: string) => {
    if (!file || !validateFile(file)) return;

    setUploading(settingKey);

    try {
      // Generate unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${settingKey}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Show upload progress
      toast({
        title: "Upload em andamento",
        description: "Fazendo upload da imagem...",
      });

      // Upload to storage with higher quality settings
      const { data, error } = await supabase.storage
        .from('system-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
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
        
        toast({
          title: "Sucesso",
          description: "Logo atualizado com sucesso!",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem. Tente novamente.",
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
      
      toast({
        title: "Sucesso",
        description: "Logo removido com sucesso!",
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent, settingKey: string) => {
    e.preventDefault();
    setDragActive(settingKey);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, settingKey: string) => {
    e.preventDefault();
    setDragActive(null);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0], settingKey);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLogo ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 transition-colors">
              <div className="flex items-center justify-center">
                <img
                  src={currentLogo}
                  alt={title}
                  className="max-h-40 max-w-full object-contain rounded-md shadow-sm"
                  onError={(e) => {
                    console.error('Image failed to load:', currentLogo);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Logo carregado
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => document.getElementById(`${settingKey}-input`)?.click()}
                disabled={uploading === settingKey || isUpdating}
                className="flex-1"
              >
                {uploading === settingKey ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Logo
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRemoveLogo(settingKey)}
                disabled={uploading === settingKey || isUpdating}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                ${dragActive === settingKey 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              onDragOver={(e) => handleDragOver(e, settingKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, settingKey)}
              onClick={() => document.getElementById(`${settingKey}-input`)?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                {uploading === settingKey ? (
                  <>
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-slate-600">Fazendo upload...</p>
                  </>
                ) : (
                  <>
                    <Image className="w-12 h-12 text-slate-400" />
                    <div>
                      <p className="text-slate-600 font-medium mb-1">
                        {dragActive === settingKey ? 'Solte a imagem aqui' : 'Arraste uma imagem ou clique para selecionar'}
                      </p>
                      <p className="text-sm text-slate-500">
                        Suporte para PNG, JPG, JPEG, GIF, WebP
                      </p>
                    </div>
                  </>
                )}
              </div>
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
        
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span>Formatos aceitos: PNG, JPG, JPEG, GIF, WebP</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span>Tamanho máximo: 20MB</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span>Recomendado: Imagens de alta resolução com fundo transparente</span>
          </div>
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
          <CardTitle>Informações sobre Upload de Logos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Os logos carregados serão utilizados na geração de PDFs e relatórios.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Suporte aprimorado para imagens de alta resolução (até 20MB).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Recomenda-se usar imagens com fundo transparente (PNG) para melhor resultado.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Funcionalidade de arrastar e soltar para upload mais rápido.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>As imagens são armazenadas de forma segura no sistema.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Apenas usuários administradores podem alterar essas configurações.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
