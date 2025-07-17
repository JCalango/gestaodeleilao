
import React, { useState } from 'react';
import { Camera, Eye, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Vistoria } from '@/types/vistoria';

interface PhotosCardProps {
  vistoria: Vistoria;
}

const PhotosCard: React.FC<PhotosCardProps> = ({ vistoria }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photoCategories = [
    { key: 'fotos_frente', label: 'Frente', photos: vistoria.fotos_frente || [] },
    { key: 'fotos_lateral_esquerda', label: 'Lateral Esquerda', photos: vistoria.fotos_lateral_esquerda || [] },
    { key: 'fotos_lateral_direita', label: 'Lateral Direita', photos: vistoria.fotos_lateral_direita || [] },
    { key: 'fotos_traseira', label: 'Traseira', photos: vistoria.fotos_traseira || [] },
    { key: 'fotos_chassi', label: 'Chassi', photos: vistoria.fotos_chassi || [] },
    { key: 'fotos_motor', label: 'Motor', photos: vistoria.fotos_motor || [] },
  ];

  const totalPhotos = photoCategories.reduce((total, category) => total + category.photos.length, 0);

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
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500">Nenhuma foto cadastrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Fotos do Veículo ({totalPhotos})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {photoCategories.map((category) => {
            if (category.photos.length === 0) return null;
            
            return (
              <div key={category.key}>
                <h4 className="font-medium text-slate-900 mb-3">{category.label} ({category.photos.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {category.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`${category.label} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-200 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setSelectedPhoto(photo)}
                        onError={(e) => {
                          console.error('Error loading image:', photo);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Visualizar Foto
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="flex justify-center">
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Error loading enlarged image:', selectedPhoto);
                  e.currentTarget.src = '/placeholder.svg';
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
