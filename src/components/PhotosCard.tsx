import React, { useState, useEffect, useMemo } from 'react';
import { Camera, Eye, X, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPhotoPublicUrl } from '@/lib/supabaseClient';

// Tipagem para as categorias de fotos
interface PhotoCategory {
  key: keyof Pick<any, 'fotos_frente' | 'fotos_lateral_esquerda' | 'fotos_lateral_direita' | 'fotos_traseira' | 'fotos_chassi' | 'fotos_motor'>;
  label: string;
  photos: string[];
  urls: string[];
  loading: boolean;
  errors: string[];
}

interface PhotosCardProps {
  vistoria: any;
  photoUrls?: Record<string, string[]>;
}

const PhotosCard: React.FC<PhotosCardProps> = ({ vistoria, photoUrls = {} }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Configuração das categorias de fotos
  const photoCategories: PhotoCategory[] = useMemo(() => [
    {
      key: 'fotos_frente',
      label: 'Frente',
      photos: vistoria?.fotos_frente || [],
      urls: [],
      loading: false,
      errors: []
    },
    {
      key: 'fotos_lateral_esquerda',
      label: 'Lateral Esquerda',
      photos: vistoria?.fotos_lateral_esquerda || [],
      urls: [],
      loading: false,
      errors: []
    },
    {
      key: 'fotos_lateral_direita',
      label: 'Lateral Direita',
      photos: vistoria?.fotos_lateral_direita || [],
      urls: [],
      loading: false,
      errors: []
    },
    {
      key: 'fotos_traseira',
      label: 'Traseira',
      photos: vistoria?.fotos_traseira || [],
      urls: [],
      loading: false,
      errors: []
    },
    {
      key: 'fotos_chassi',
      label: 'Chassi',
      photos: vistoria?.fotos_chassi || [],
      urls: [],
      loading: false,
      errors: []
    },
    {
      key: 'fotos_motor',
      label: 'Motor',
      photos: vistoria?.fotos_motor || [],
      urls: [],
      loading: false,
      errors: []
    },
  ], [vistoria]);

  // Gerar URLs das fotos quando a vistoria mudar
  const processedCategories = useMemo(() => {
    return photoCategories.map(category => {
      const categoryKey = category.key.replace('fotos_', '');
      
      // Usar photoUrls se disponível, senão gerar URLs
      const urls = photoUrls[categoryKey] || category.photos.map(path => {
        if (!path) return '';
        
        // Se o path já é uma URL completa, usar diretamente
        if (path.startsWith('http')) return path;
        
        // Construir o caminho correto
        const cleanPath = path.startsWith(categoryKey + '/') ? path : `${categoryKey}/${path}`;
        return getPhotoPublicUrl(cleanPath);
      });

      return {
        ...category,
        urls: urls.filter(url => url !== ''),
        errors: []
      };
    });
  }, [photoCategories, photoUrls]);

  const totalPhotos = processedCategories.reduce((total, category) => total + category.urls.length, 0);

  // Função para lidar com erro no carregamento de imagem
  const handleImageError = (photoUrl: string, categoryKey: string, photoIndex: number) => {
    console.error(`Erro ao carregar imagem: ${photoUrl}`);
    setImageErrors(prev => ({
      ...prev,
      [`${categoryKey}_${photoIndex}`]: true
    }));
  };

  // Função para lidar com o carregamento da imagem
  const handleImageLoad = (categoryKey: string, photoIndex: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [`${categoryKey}_${photoIndex}`]: false
    }));
  };

  // Função para iniciar o carregamento da imagem
  const handleImageLoadStart = (categoryKey: string, photoIndex: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [`${categoryKey}_${photoIndex}`]: true
    }));
  };

  // Componente para exibir uma foto individual
  const PhotoItem: React.FC<{
    url: string;
    categoryKey: string;
    categoryLabel: string;
    index: number;
  }> = ({ url, categoryKey, categoryLabel, index }) => {
    const loadingKey = `${categoryKey}_${index}`;
    const isLoading = imageLoadingStates[loadingKey];
    const hasError = imageErrors[loadingKey];

    return (
      <div className="relative group bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        )}
        
        {hasError ? (
          <div className="w-full h-24 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <AlertCircle className="w-6 h-6 mb-1" />
            <span className="text-xs">Erro ao carregar</span>
          </div>
        ) : (
          <img
            src={url}
            alt={`${categoryLabel} ${index + 1}`}
            className={`w-full h-24 object-cover cursor-pointer transition-all duration-200 hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => !isLoading && setSelectedPhoto(url)}
            onLoadStart={() => handleImageLoadStart(categoryKey, index)}
            onLoad={() => handleImageLoad(categoryKey, index)}
            onError={() => handleImageError(url, categoryKey, index)}
            loading="lazy"
          />
        )}
        
        {!isLoading && !hasError && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => setSelectedPhoto(url)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Se não há fotos, mostrar estado vazio
  if (totalPhotos === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Fotos do Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma foto cadastrada</h3>
            <p className="text-slate-500">As fotos do veículo aparecerão aqui quando forem adicionadas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Fotos do Veículo
            </div>
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {totalPhotos} foto{totalPhotos !== 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {processedCategories.map((category) => {
            if (category.urls.length === 0) return null;
            
            return (
              <div key={category.key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-lg">{category.label}</h4>
                  <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {category.urls.length} foto{category.urls.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {category.urls.map((url, index) => (
                    <PhotoItem
                      key={`${category.key}_${index}`}
                      url={url}
                      categoryKey={category.key}
                      categoryLabel={category.label}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Modal para visualizar foto ampliada */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Visualizar Foto</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="flex justify-center items-center p-4 max-h-[calc(90vh-120px)] overflow-hidden">
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  console.error('Erro ao carregar imagem ampliada:', selectedPhoto);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotosCard;