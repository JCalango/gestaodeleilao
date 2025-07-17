
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface PhotoItemProps {
  photo: string;
  index: number;
  sectionLabel: string;
  onReplace: (index: number) => void;
  onRemove: (index: number) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ 
  photo, 
  index, 
  sectionLabel, 
  onReplace, 
  onRemove 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Error loading image:', photo);
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="relative group">
      <div className="w-full h-24 bg-slate-100 rounded-lg border overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        )}
        
        {imageError && (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <span className="text-xs text-slate-400">Erro ao carregar</span>
          </div>
        )}
        
        <img
          src={photo}
          alt={`${sectionLabel} ${index + 1}`}
          className={`w-full h-full object-cover cursor-pointer transition-all duration-200 hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
          }`}
          onClick={() => window.open(photo, '_blank')}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onReplace(index)}
          title="Substituir foto"
        >
          <Upload className="w-3 h-3" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(index)}
          title="Remover foto"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default PhotoItem;
