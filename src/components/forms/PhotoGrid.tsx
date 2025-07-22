
import React from 'react';
import { Image } from 'lucide-react';
import PhotoItem from './PhotoItem';

interface PhotoGridProps {
  photos: string[];
  sectionLabel: string;
  onReplacePhoto: (index: number) => void;
  onRemovePhoto: (index: number) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  sectionLabel,
  onReplacePhoto,
  onRemovePhoto
}) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
        <div className="text-center">
          <Image className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">Nenhuma foto adicionada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {photos.map((photo, index) => (
        <PhotoItem
          key={`${photo}-${index}`}
          photo={photo}
          index={index}
          sectionLabel={sectionLabel}
          onReplace={onReplacePhoto}
          onRemove={onRemovePhoto}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
