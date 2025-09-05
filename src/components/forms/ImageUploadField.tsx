import React, { useCallback } from 'react';
import { Upload, X, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { UploadProgress } from '@/components/ui/loading-states';
import { ImageManagementHook } from '@/hooks/useImageManagement';

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  section: string;
  imageManager: ImageManagementHook;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

export function ImageUploadField({
  label,
  description,
  section,
  imageManager,
  maxImages = 10,
  className,
  disabled = false
}: ImageUploadFieldProps) {
  const { state, operations, utils } = imageManager;
  const { uploading, progress, errors, images } = state;
  const { uploadImages, removeImage, clearSection } = operations;
  const { clearErrors } = utils;

  const isUploading = uploading[section] || false;
  const uploadProgress = progress[section] || 0;
  const error = errors[section];
  const sectionImages = images[section] || [];
  const canUploadMore = sectionImages.length < maxImages;

  // Manipular seleção de arquivos
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const remainingSlots = maxImages - sectionImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length < files.length) {
      // Mostrar aviso se alguns arquivos foram ignorados
      console.warn(`Apenas ${filesToUpload.length} arquivos serão enviados. Limite máximo: ${maxImages}`);
    }

    clearErrors(section);
    await uploadImages(filesToUpload, section);
  }, [uploadImages, section, maxImages, sectionImages.length, disabled, clearErrors]);

  // Abrir seletor de arquivos
  const openFileSelector = useCallback(() => {
    if (disabled || !canUploadMore) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.multiple = true;
    input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
    input.click();
  }, [handleFileSelect, disabled, canUploadMore]);

  // Substituir imagem
  const handleReplaceImage = useCallback((index: number) => {
    if (disabled) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        clearErrors(section);
        await removeImage(section, index);
        await uploadImages([file], section);
      }
    };
    input.click();
  }, [removeImage, uploadImages, section, disabled, clearErrors]);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{label}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {sectionImages.length}/{maxImages}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controles de upload */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="flex-1"
              disabled={disabled || isUploading || !canUploadMore}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading || !canUploadMore}
              onClick={openFileSelector}
            >
              <Upload className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>

          {canUploadMore && (
            <p className="text-xs text-muted-foreground">
              Você pode adicionar mais {maxImages - sectionImages.length} imagem(ns).
            </p>
          )}
        </div>

        {/* Barra de progresso */}
        {isUploading && (
          <UploadProgress 
            progress={uploadProgress} 
            message="Enviando imagens..."
          />
        )}

        {/* Exibir erro */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Grid de imagens */}
        <div className="space-y-3">
          {sectionImages.length === 0 ? (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {disabled ? 'Upload desabilitado' : 'Nenhuma imagem adicionada'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sectionImages.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={imageUrl}
                        alt={`${label} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay com controles */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleReplaceImage(index)}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(section, index)}
                        disabled={disabled}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Indicador de posição */}
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão para limpar todas */}
              {sectionImages.length > 1 && !disabled && (
                <div className="flex justify-center pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => clearSection(section)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover Todas ({sectionImages.length})
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}