
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PhotoUploadState {
  photos: Record<string, string[]>;
  uploading: Record<string, boolean>;
  uploadProgress: Record<string, number>;
  uploadErrors: Record<string, string>;
}

export const usePhotoUpload = (initialPhotos: Record<string, string[]> = {}) => {
  const [state, setState] = useState<PhotoUploadState>({
    photos: initialPhotos,
    uploading: {},
    uploadProgress: {},
    uploadErrors: {}
  });

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

  const handleFileUpload = useCallback(async (files: FileList | null, section: string) => {
    if (!files || files.length === 0) return;

    setState(prev => ({
      ...prev,
      uploadErrors: { ...prev.uploadErrors, [section]: '' },
      uploading: { ...prev.uploading, [section]: true },
      uploadProgress: { ...prev.uploadProgress, [section]: 0 }
    }));

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          setState(prev => ({
            ...prev,
            uploadProgress: { ...prev.uploadProgress, [section]: ((index + 1) / files.length) * 80 }
          }));
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
      
      setState(prev => ({
        ...prev,
        uploadProgress: { ...prev.uploadProgress, [section]: 100 }
      }));

      if (validUrls.length > 0) {
        setState(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            [section]: [...(prev.photos[section] || []), ...validUrls]
          }
        }));
        
        console.log(`Successfully uploaded ${validUrls.length} photos for section ${section}`);
        
        toast({
          title: "Sucesso",
          description: `${validUrls.length} foto(s) enviada(s) com sucesso!${failedCount > 0 ? ` ${failedCount} falhou(ram).` : ''}`,
        });
      }

      if (failedCount > 0) {
        setState(prev => ({
          ...prev,
          uploadErrors: { 
            ...prev.uploadErrors, 
            [section]: `${failedCount} arquivo(s) falharam no upload. Verifique o formato e tamanho.` 
          }
        }));
      }
    } catch (error) {
      console.error('General upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
      setState(prev => ({
        ...prev,
        uploadErrors: { ...prev.uploadErrors, [section]: errorMessage }
      }));
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setState(prev => ({
        ...prev,
        uploading: { ...prev.uploading, [section]: false }
      }));
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: { ...prev.uploadProgress, [section]: 0 }
        }));
      }, 1000);
    }
  }, []);

  const removePhotoFromStorage = async (photoUrl: string): Promise<void> => {
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
  };

  const removePhoto = useCallback(async (section: string, index: number) => {
    const photoUrl = state.photos[section]?.[index];
    if (!photoUrl) return;

    await removePhotoFromStorage(photoUrl);

    setState(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [section]: prev.photos[section]?.filter((_, i) => i !== index) || []
      }
    }));
    
    toast({
      title: "Foto removida",
      description: "A foto foi removida com sucesso.",
    });
  }, [state.photos]);

  const clearAllPhotos = useCallback(async (section: string) => {
    const sectionPhotos = state.photos[section] || [];
    if (sectionPhotos.length === 0) return;

    try {
      const removePromises = sectionPhotos.map(async (photoUrl) => {
        await removePhotoFromStorage(photoUrl);
      });

      await Promise.all(removePromises);
      
      setState(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [section]: []
        }
      }));
      
      toast({
        title: "Fotos removidas",
        description: `Todas as fotos da seção foram removidas.`,
      });
    } catch (error) {
      console.error('Error clearing photos:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover fotos. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [state.photos]);

  const replacePhoto = useCallback((section: string, index: number) => {
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
  }, [handleFileUpload, removePhoto]);

  const setPhotos = useCallback((newPhotos: Record<string, string[]>) => {
    setState(prev => ({
      ...prev,
      photos: newPhotos
    }));
  }, []);

  return {
    ...state,
    handleFileUpload,
    removePhoto,
    clearAllPhotos,
    replacePhoto,
    setPhotos
  };
};
