
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';

interface PhotoUploadControlsProps {
  sectionKey: string;
  isUploading: boolean;
  uploadProgress: number;
  onFileUpload: (files: FileList | null) => void;
}

const PhotoUploadControls: React.FC<PhotoUploadControlsProps> = ({
  sectionKey,
  isUploading,
  uploadProgress,
  onFileUpload
}) => {
  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.multiple = true;
    input.onchange = (e) => onFileUpload((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={(e) => onFileUpload(e.target.files)}
          className="flex-1"
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={handleButtonClick}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {Math.round(uploadProgress)}%
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Enviar
            </>
          )}
        </Button>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoUploadControls;
