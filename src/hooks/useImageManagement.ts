import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ImageUploadState {
  images: Record<string, string[]>;
  uploading: Record<string, boolean>;
  progress: Record<string, number>;
  errors: Record<string, string>;
}

export interface ImageUploadOptions {
  bucketName: string;
  maxFileSize?: number; // em bytes
  allowedTypes?: string[];
  compressionQuality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageManagementHook {
  state: ImageUploadState;
  operations: {
    uploadImages: (files: FileList | File[], section: string) => Promise<string[]>;
    replaceImage: (section: string, index: number, newFile: File) => Promise<boolean>;
    removeImage: (section: string, index: number) => Promise<boolean>;
    clearSection: (section: string) => Promise<boolean>;
    setImages: (images: Record<string, string[]>) => void;
  };
  utils: {
    validateFile: (file: File) => string | null;
    compressImage: (file: File) => Promise<File>;
    extractPathFromUrl: (url: string) => string | null;
    clearErrors: (section?: string) => void;
  };
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  bucketName: 'vistoria-fotos',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  compressionQuality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

export function useImageManagement(
  options: ImageUploadOptions,
  onImagesChange?: (images: Record<string, string[]>) => void
): ImageManagementHook {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const onImagesChangeRef = useRef(onImagesChange);
  onImagesChangeRef.current = onImagesChange;

  const [state, setState] = useState<ImageUploadState>({
    images: {},
    uploading: {},
    progress: {},
    errors: {}
  });

  // Validação de arquivo
  const validateFile = useCallback((file: File): string | null => {
    if (!config.allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido. Use apenas: ${config.allowedTypes.join(', ')}`;
    }

    if (file.size > config.maxFileSize) {
      const sizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(1);
      return `Arquivo muito grande. Tamanho máximo: ${sizeMB}MB`;
    }

    return null;
  }, [config.allowedTypes, config.maxFileSize]);

  // Compressão de imagem
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');

      if (!ctx) {
        reject(new Error('Não foi possível criar contexto do canvas'));
        return;
      }

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calcular dimensões mantendo aspect ratio
          if (width > height) {
            if (width > config.maxWidth) {
              height = (height * config.maxWidth) / width;
              width = config.maxWidth;
            }
          } else {
            if (height > config.maxHeight) {
              width = (width * config.maxHeight) / height;
              height = config.maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Falha na compressão da imagem'));
              }
            },
            'image/jpeg',
            config.compressionQuality
          );
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(img.src);
        }
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem para compressão'));
        URL.revokeObjectURL(img.src);
      };

      img.src = URL.createObjectURL(file);
    });
  }, [config.maxWidth, config.maxHeight, config.compressionQuality]);

  // Extrair caminho do arquivo da URL
  const extractPathFromUrl = useCallback((url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // Para URLs do Supabase Storage: /storage/v1/object/public/bucket/path/to/file
      const bucketIndex = pathParts.findIndex(part => part === config.bucketName);
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch (error) {
      console.error('Error extracting path from URL:', error);
      return null;
    }
  }, [config.bucketName]);

  // Upload de uma única imagem
  const uploadSingleImage = useCallback(async (file: File, section: string): Promise<string | null> => {
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const compressedFile = await compressImage(file);
      
      const fileExt = 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${section}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(config.bucketName)
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from(config.bucketName)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }, [validateFile, compressImage, config.bucketName]);

  // Upload de múltiplas imagens
  const uploadImages = useCallback(async (files: FileList | File[], section: string): Promise<string[]> => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return [];

    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [section]: '' },
      uploading: { ...prev.uploading, [section]: true },
      progress: { ...prev.progress, [section]: 0 }
    }));

    try {
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          setState(prev => ({
            ...prev,
            progress: { 
              ...prev.progress, 
              [section]: ((index + 1) / fileArray.length) * 90 
            }
          }));
          
          const url = await uploadSingleImage(file, section);
          return url;
        } catch (error) {
          console.error(`Error uploading file ${index + 1}:`, error);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      const failedCount = uploadedUrls.length - validUrls.length;

      setState(prev => {
        const newImages = {
          ...prev.images,
          [section]: [...(prev.images[section] || []), ...validUrls]
        };

        // Notificar componente pai
        if (onImagesChangeRef.current) {
          onImagesChangeRef.current(newImages);
        }

        return {
          ...prev,
          images: newImages,
          progress: { ...prev.progress, [section]: 100 }
        };
      });

      if (validUrls.length > 0) {
        toast({
          title: "Upload concluído",
          description: `${validUrls.length} imagem(ns) enviada(s) com sucesso!${failedCount > 0 ? ` ${failedCount} falharam.` : ''}`,
        });
      }

      if (failedCount > 0) {
        setState(prev => ({
          ...prev,
          errors: { 
            ...prev.errors, 
            [section]: `${failedCount} arquivo(s) falharam no upload. Verifique o formato e tamanho.` 
          }
        }));
      }

      return validUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no upload';
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [section]: errorMessage }
      }));
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });

      return [];
    } finally {
      setState(prev => ({
        ...prev,
        uploading: { ...prev.uploading, [section]: false }
      }));
      
      // Resetar progresso após 1 segundo
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          progress: { ...prev.progress, [section]: 0 }
        }));
      }, 1000);
    }
  }, [uploadSingleImage]);

  // Remover imagem do storage
  const removeImageFromStorage = useCallback(async (imageUrl: string): Promise<boolean> => {
    try {
      const filePath = extractPathFromUrl(imageUrl);
      if (!filePath) {
        console.warn('Could not extract file path from URL:', imageUrl);
        return false;
      }

      const { error } = await supabase.storage
        .from(config.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Error removing file from storage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error processing image removal:', error);
      return false;
    }
  }, [extractPathFromUrl, config.bucketName]);

  // Substituir imagem
  const replaceImage = useCallback(async (section: string, index: number, newFile: File): Promise<boolean> => {
    const oldImageUrl = state.images[section]?.[index];
    if (!oldImageUrl) return false;

    try {
      // Upload nova imagem primeiro
      const newUrls = await uploadImages([newFile], section);
      if (newUrls.length === 0) return false;

      // Remover imagem antiga do storage
      await removeImageFromStorage(oldImageUrl);

      // Atualizar estado removendo a imagem antiga e mantendo a nova
      setState(prev => {
        const sectionImages = [...(prev.images[section] || [])];
        sectionImages.splice(index, 1); // Remove a antiga
        
        const newImages = {
          ...prev.images,
          [section]: sectionImages
        };

        // Notificar componente pai
        if (onImagesChangeRef.current) {
          onImagesChangeRef.current(newImages);
        }

        return {
          ...prev,
          images: newImages
        };
      });

      toast({
        title: "Imagem substituída",
        description: "A imagem foi substituída com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error replacing image:', error);
      toast({
        title: "Erro",
        description: "Erro ao substituir imagem. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.images, uploadImages, removeImageFromStorage]);

  // Remover imagem específica
  const removeImage = useCallback(async (section: string, index: number): Promise<boolean> => {
    const imageUrl = state.images[section]?.[index];
    if (!imageUrl) return false;

    try {
      await removeImageFromStorage(imageUrl);

      setState(prev => {
        const newImages = {
          ...prev.images,
          [section]: prev.images[section]?.filter((_, i) => i !== index) || []
        };

        // Notificar componente pai
        if (onImagesChangeRef.current) {
          onImagesChangeRef.current(newImages);
        }

        return {
          ...prev,
          images: newImages
        };
      });

      toast({
        title: "Imagem removida",
        description: "A imagem foi removida com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagem. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.images, removeImageFromStorage]);

  // Limpar seção inteira
  const clearSection = useCallback(async (section: string): Promise<boolean> => {
    const sectionImages = state.images[section] || [];
    if (sectionImages.length === 0) return true;

    try {
      const removePromises = sectionImages.map(imageUrl => removeImageFromStorage(imageUrl));
      await Promise.all(removePromises);

      setState(prev => {
        const newImages = {
          ...prev.images,
          [section]: []
        };

        // Notificar componente pai
        if (onImagesChangeRef.current) {
          onImagesChangeRef.current(newImages);
        }

        return {
          ...prev,
          images: newImages
        };
      });

      toast({
        title: "Imagens removidas",
        description: "Todas as imagens da seção foram removidas.",
      });

      return true;
    } catch (error) {
      console.error('Error clearing section:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover imagens. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  }, [state.images, removeImageFromStorage]);

  // Definir imagens manualmente
  const setImages = useCallback((images: Record<string, string[]>) => {
    setState(prev => ({
      ...prev,
      images
    }));

    // Notificar componente pai
    if (onImagesChangeRef.current) {
      onImagesChangeRef.current(images);
    }
  }, []);

  // Limpar erros
  const clearErrors = useCallback((section?: string) => {
    setState(prev => ({
      ...prev,
      errors: section 
        ? { ...prev.errors, [section]: '' }
        : {}
    }));
  }, []);

  return {
    state,
    operations: {
      uploadImages,
      replaceImage,
      removeImage,
      clearSection,
      setImages,
    },
    utils: {
      validateFile,
      compressImage,
      extractPathFromUrl,
      clearErrors,
    },
  };
}