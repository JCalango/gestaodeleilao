
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const PhotoUploadSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fotos do Veículo</CardTitle>
        <CardDescription>Upload das fotos necessárias para a vistoria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos da Frente</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos Lateral Esquerda</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos Lateral Direita</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos do Chassi</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos da Traseira</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos do Motor</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*"
              className="cursor-pointer"
            />
          </div>
        </div>
        
        <p className="text-sm text-slate-500">
          * Selecione múltiplas fotos para cada categoria. Formatos aceitos: JPG, PNG, WebP
        </p>
      </CardContent>
    </Card>
  );
};

export default PhotoUploadSection;
