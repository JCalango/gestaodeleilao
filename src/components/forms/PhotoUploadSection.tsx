
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  useEffect(() => {
    setPhotos(initialPhotos);
  }, [initialPhotos]);

  const uploadPhoto = async (file: File, section: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `vistoria-fotos/${section}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vistoria-fotos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('vistoria-fotos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return null;
    }
  };

  const handleFileUpload = async (files: FileList | null, section: string) => {
    if (!files || files.length === 0) return;

    setUploading(prev => ({ ...prev, [section]: true }));

    try {
      const uploadPromises = Array.from(files).map(file => uploadPhoto(file, section));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);
      
      if (validUrls.length > 0) {
        const updatedPhotos = {
          ...photos,
          [section]: [...(photos[section] || []), ...validUrls]
        };
        
        setPhotos(updatedPhotos);
        onPhotosChange(updatedPhotos);
        
        toast({
          title: "Sucesso",
          description: `${validUrls.length} foto(s) enviada(s) com sucesso!`,
        });
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar fotos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [section]: false }));
    }
  };

  const removePhoto = (section: string, index: number) => {
    const updatedPhotos = {
      ...photos,
      [section]: photos[section]?.filter((_, i) => i !== index) || []
    };
    
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Fotos do Veículo
        </CardTitle>
        <CardDescription>
          Adicione fotos do veículo para documentar a vistoria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {photoSections.map((section) => (
          <div key={section.key} className="space-y-3">
            <div>
              <Label className="text-sm font-medium">{section.label}</Label>
              <p className="text-xs text-slate-600">{section.description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
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
              >
                {uploading[section.key] ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>

            {photos[section.key] && photos[section.key].length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos[section.key].map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`${section.label} ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(section.key, index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {(!photos[section.key] || photos[section.key].length === 0) && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-lg">
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
