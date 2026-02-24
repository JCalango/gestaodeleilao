
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, RotateCcw, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';
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
  // Memoize the callback to prevent unnecessary re-renders
  const stableOnPhotosChange = useMemo(() => onPhotosChange, []);

  const {
    photos,
    uploading,
    uploadProgress,
    uploadErrors,
    handleFileUpload,
    removePhoto,
    clearAllPhotos,
    replacePhoto,
    setPhotos
  } = usePhotoUpload(stableOnPhotosChange);

  // Set initial photos only once when component mounts or when initialPhotos change significantly
  useEffect(() => {
    const hasPhotos = Object.keys(initialPhotos).some(key => 
      initialPhotos[key] && initialPhotos[key].length > 0
    );
    
    const currentHasPhotos = Object.keys(photos).some(key => 
      photos[key] && photos[key].length > 0
    );

    // Only set photos if we have initial photos and current state is empty
    if (hasPhotos && !currentHasPhotos) {
      console.log('Setting initial photos:', initialPhotos);
      setPhotos(initialPhotos);
    }
  }, [initialPhotos, photos, setPhotos]);

  const [isOpen, setIsOpen] = useState(false);

  const totalPhotos = Object.values(photos).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Fotos do Veículo
                  {totalPhotos > 0 && (
                    <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {totalPhotos} foto{totalPhotos !== 1 ? 's' : ''}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Adicione fotos do veículo para documentar a vistoria. Formatos aceitos: JPEG, PNG, WebP (máx. 10MB cada)
                </CardDescription>
              </div>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {photoSections.map((section) => (
              <div key={section.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{section.label}</Label>
                    <p className="text-xs text-muted-foreground">{section.description}</p>
                  </div>
                  {photos[section.key] && photos[section.key].length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => clearAllPhotos(section.key)}
                      className="text-destructive hover:text-destructive"
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default PhotoUploadSection;
