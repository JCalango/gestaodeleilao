import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, RotateCcw, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhotoUploadControls from './PhotoUploadControls';
import PhotoGrid from './PhotoGrid';

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

  // Notificar mudanças nas fotos usando useCallback para evitar re-renderizações
  const notifyPhotosChange = useCallback((newPhotos: Record<string, string[]>) => {
    console.log('PhotoUploadSection: photos state changed:', newPhotos);
    onPhotosChange(newPhotos);
  }, [onPhotosChange]);

  useEffect(() => {
    notifyPhotosChange(photos);
  }, [photos, notifyPhotosChange]);

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
      const url = new URL(photoUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-3).join('/');

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

      await removePhoto(section, index);
      
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
            
            <PhotoUploadControls
              sectionKey={section.key}
              isUploading={uploading[section.key] || false}
              uploadProgress={uploadProgress[section.key] || 0}
              onFileUpload={(files) => handleFileUpload(files, section.key)}
            />

            {uploadErrors[section.key] && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {uploadErrors[section.key]}
                </AlertDescription>
              </Alert>
            )}

            <PhotoGrid
              photos={photos[section.key] || []}
              sectionLabel={section.label}
              onReplacePhoto={(index) => replacePhoto(section.key, index)}
              onRemovePhoto={(index) => removePhoto(section.key, index)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PhotoUploadSection;
