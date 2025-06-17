
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadSectionProps {
  onPhotosChange?: (photos: Record<string, string[]>) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ onPhotosChange }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string[]>>({
    frente: [],
    lateral_esquerda: [],
    lateral_direita: [],
    chassi: [],
    traseira: [],
    motor: []
  });

  const photoCategories = [
    { key: 'frente', label: 'Fotos da Frente' },
    { key: 'lateral_esquerda', label: 'Fotos Lateral Esquerda' },
    { key: 'lateral_direita', label: 'Fotos Lateral Direita' },
    { key: 'chassi', label: 'Fotos do Chassi' },
    { key: 'traseira', label: 'Fotos da Traseira' },
    { key: 'motor', label: 'Fotos do Motor' }
  ];

  const uploadPhoto = async (file: File, category: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer upload de fotos.",
        variant: "destructive"
      });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      setUploading(prev => ({ ...prev, [category]: true }));

      const { data, error } = await supabase.storage
        .from('vistoria-fotos')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vistoria-fotos')
        .getPublicUrl(fileName);

      const newPhotos = {
        ...uploadedPhotos,
        [category]: [...uploadedPhotos[category], urlData.publicUrl]
      };

      setUploadedPhotos(newPhotos);
      onPhotosChange?.(newPhotos);

      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso!",
      });

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar foto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(prev => ({ ...prev, [category]: false }));
    }
  };

  const removePhoto = async (category: string, photoUrl: string, index: number) => {
    try {
      // Extract file path from URL
      const urlParts = photoUrl.split('/vistoria-fotos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        const { error } = await supabase.storage
          .from('vistoria-fotos')
          .remove([filePath]);

        if (error) {
          console.error('Error deleting file:', error);
        }
      }

      // Remove from state
      const newPhotos = {
        ...uploadedPhotos,
        [category]: uploadedPhotos[category].filter((_, i) => i !== index)
      };

      setUploadedPhotos(newPhotos);
      onPhotosChange?.(newPhotos);

      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!",
      });

    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover foto.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive"
        });
        continue;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Tamanho máximo: 50MB.",
          variant: "destructive"
        });
        continue;
      }

      await uploadPhoto(file, category);
    }

    // Reset input value
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotos do Veículo</CardTitle>
        <CardDescription>Upload das fotos necessárias para a vistoria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photoCategories.map(({ key, label }) => (
            <div key={key} className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  {label}
                  {uploading[key] && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </label>
                
                <div className="relative">
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleFileChange(e, key)}
                    disabled={uploading[key]}
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Display uploaded photos */}
              {uploadedPhotos[key].length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    {uploadedPhotos[key].length} foto(s) enviada(s)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedPhotos[key].map((photoUrl, index) => (
                      <div key={index} className="relative group">
                        <Badge 
                          variant="secondary" 
                          className="pr-8 cursor-pointer hover:bg-gray-200"
                          onClick={() => window.open(photoUrl, '_blank')}
                        >
                          Foto {index + 1}
                        </Badge>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(key, photoUrl, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Instruções:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Selecione múltiplas fotos para cada categoria</li>
              <li>• Formatos aceitos: JPG, PNG, WebP</li>
              <li>• Tamanho máximo por foto: 50MB</li>
              <li>• As fotos são salvas automaticamente</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUploadSection;
