
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X, Image, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhotoUploadSectionProps {
  onPhotosChange: (photos: Record<string, string[]>) => void;
  initialPhotos?: Record<string, string[]>;
}

interface PhotoSection {
  key: string;
  label: string;
  description: string;
}

const photoSections: PhotoSection[] = [
  { key: 'frente', label: 'Frente do Veículo', description: 'Foto frontal do veículo' },
  { key: 'lateral_esquerda', label: 'Lateral Esquerda', description: 'Foto da lateral esquerda' },
  { key: 'lateral_direita', label: 'Lateral Direita', description: 'Foto da lateral direita' },
  { key: 'chassi', label: 'Chassi', description: 'Foto do número do chassi' },
  { key: 'traseira', label: 'Traseira do Veículo', description: 'Foto traseira do veículo' },
  { key: 'motor', label: 'Motor', description: 'Foto do motor do veículo' }
];

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ 
  onPhotosChange, 
  initialPhotos = {} 
}) => {
  const [photos, setPhotos] = useState<Record<string, string[]>>(initialPhotos);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  // Sincronizar fotos quando initialPhotos mudar
  useEffect(() => {
    console.log('PhotoUploadSection: initialPhotos changed:', initialPhotos);
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  // Notificar mudanças nas fotos
  useEffect(() => {
    console.log('PhotoUploadSection: photos state changed:', photos);
    onPhotosChange(photos);
  }, [photos, onPhotosChange]);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP.';
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande. Tamanho máximo: 10MB.';
    }

    return null;
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');

      img.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        // Calcular novas dimensões mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );

        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        console.error('Erro ao carregar imagem para compressão');
        resolve(file);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadPhoto = async (file: File, section: string): Promise<string | null> => {
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const compressedFile = await compressImage(file);
      
      const fileExt = 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `vistoria-fotos/${section}/${fileName}`;

      console.log(`Uploading photo: ${filePath}, Size: ${compressedFile.size} bytes`);

      const { error: uploadError } = await supabase.storage
        .from('vistoria-fotos')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from('vistoria-fotos')
        .getPublicUrl(filePath);

      console.log(`Upload completed: ${data.publicUrl}`);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  };

  const handleFileUpload = async (files: FileList | null, section: string) => {
    if (!files || files.length === 0) return;

    setUploadErrors(prev => ({ ...prev, [section]: '' }));
    setUploading(prev => ({ ...prev, [section]: true }));
    setUploadProgress(prev => ({ ...prev, [section]: 0 }));

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          setUploadProgress(prev => ({ ...prev, [section]: ((index + 1) / files.length) * 80 }));
          const url = await uploadPhoto(file, section);
          return url;
        } catch (error) {
          console.error(`Error uploading file ${index + 1}:`, error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      const failedCount = uploadedUrls.length - validUrls.length;
      
      setUploadProgress(prev => ({ ...prev, [section]: 100 }));

      if (validUrls.length > 0) {
        const updatedPhotos = {
          ...photos,
          [section]: [...(photos[section] || []), ...validUrls]
        };
        
        console.log(`Successfully uploaded ${validUrls.length} photos for section ${section}`);
        setPhotos(updatedPhotos);
        
        toast({
          title: "Sucesso",
          description: `${validUrls.length} foto(s) enviada(s) com sucesso!${failedCount > 0 ? ` ${failedCount} falhou(ram).` : ''}`,
        });
      }

      if (failedCount > 0) {
        setUploadErrors(prev => ({ 
          ...prev, 
          [section]: `${failedCount} arquivo(s) falharam no upload. Verifique o formato e tamanho.` 
        }));
      }
    } catch (error) {
      console.error('General upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
      setUploadErrors(prev => ({ ...prev, [section]: errorMessage }));
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [section]: false }));
      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, [section]: 0 }));
      }, 1000);
    }
  };

  const removePhoto = async (section: string, index: number) => {
    const photoUrl = photos[section]?.[index];
    if (!photoUrl) return;

    try {
      // Extrair o caminho do arquivo da URL
      const url = new URL(photoUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-3).join('/'); // vistoria-fotos/section/filename

      // Remover do storage
      const { error } = await supabase.storage
        .from('vistoria-fotos')
        .remove([filePath]);

      if (error) {
        console.error('Error removing file from storage:', error);
      } else {
        console.log(`File removed from storage: ${filePath}`);
      }
    } catch (error) {
      console.error('Error processing photo URL:', error);
    }

    // Remover da lista local
    const updatedPhotos = {
      ...photos,
      [section]: photos[section]?.filter((_, i) => i !== index) || []
    };
    
    setPhotos(updatedPhotos);
    
    toast({
      title: "Foto removida",
      description: "A foto foi removida com sucesso.",
    });
  };

  const clearAllPhotos = async (section: string) => {
    const sectionPhotos = photos[section] || [];
    if (sectionPhotos.length === 0) return;

    try {
      // Remover todas as fotos do storage
      const removePromises = sectionPhotos.map(async (photoUrl) => {
        try {
          const url = new URL(photoUrl);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(-3).join('/');
          
          const { error } = await supabase.storage
            .from('vistoria-fotos')
            .remove([filePath]);

          if (error) {
            console.error('Error removing file from storage:', error);
          }
        } catch (error) {
          console.error('Error processing photo URL:', error);
        }
      });

      await Promise.all(removePromises);
      
      // Limpar da lista local
      const updatedPhotos = {
        ...photos,
        [section]: []
      };
      
      setPhotos(updatedPhotos);
      
      toast({
        title: "Fotos removidas",
        description: `Todas as fotos de ${photoSections.find(s => s.key === section)?.label} foram removidas.`,
      });
    } catch (error) {
      console.error('Error clearing photos:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover fotos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const replacePhoto = (section: string, index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Remover a foto atual primeiro
      await removePhoto(section, index);
      
      // Fazer upload da nova foto
      const fileList = new DataTransfer();
      fileList.items.add(file);
      await handleFileUpload(fileList.files, section);
    };
    input.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Fotos do Veículo
        </CardTitle>
        <CardDescription>
          Adicione fotos do veículo para documentar a vistoria. Formatos aceitos: JPEG, PNG, WebP (máx. 10MB cada)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {photoSections.map((section) => (
          <div key={section.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{section.label}</Label>
                <p className="text-xs text-slate-600">{section.description}</p>
              </div>
              {photos[section.key] && photos[section.key].length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => clearAllPhotos(section.key)}
                  className="text-red-600 hover:text-red-700"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Limpar Todas
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={(e) => handleFileUpload(e.target.files, section.key)}
                className="flex-1"
                disabled={uploading[section.key]}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading[section.key]}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
                  input.multiple = true;
                  input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files, section.key);
                  input.click();
                }}
              >
                {uploading[section.key] ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {Math.round(uploadProgress[section.key] || 0)}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>

            {/* Barra de progresso */}
            {uploading[section.key] && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[section.key] || 0}%` }}
                />
              </div>
            )}

            {/* Exibir erros */}
            {uploadErrors[section.key] && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {uploadErrors[section.key]}
                </AlertDescription>
              </Alert>
            )}

            {/* Fotos existentes */}
            {photos[section.key] && photos[section.key].length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos[section.key].map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`${section.label} ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border cursor-pointer transition-transform hover:scale-105"
                      onClick={() => window.open(photo, '_blank')}
                      onError={(e) => {
                        console.error('Error loading image:', photo);
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => replacePhoto(section.key, index)}
                        title="Substituir foto"
                      >
                        <Upload className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(section.key, index)}
                        title="Remover foto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado vazio */}
            {(!photos[section.key] || photos[section.key].length === 0) && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Nenhuma foto adicionada</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PhotoUploadSection;
