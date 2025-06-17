
import React from 'react';
import { Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vistoria } from '@/types/vistoria';

interface VehicleInfoCardProps {
  vistoria: Vistoria;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ vistoria }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Informações do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Placa</p>
            <p className="font-medium">{vistoria.placa || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">RENAVAM</p>
            <p className="font-medium">{vistoria.renavam || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Marca</p>
            <p className="font-medium">{vistoria.marca || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Modelo</p>
            <p className="font-medium">{vistoria.modelo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Ano Fabricação</p>
            <p className="font-medium">{vistoria.ano_fabricacao || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Ano Modelo</p>
            <p className="font-medium">{vistoria.ano_modelo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Cor</p>
            <p className="font-medium">{vistoria.cor || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Combustível</p>
            <p className="font-medium">{vistoria.tipo_combustivel || 'N/A'}</p>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Nº Motor</p>
              <p className="font-medium">{vistoria.numero_motor || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Condição Motor</p>
              <p className="font-medium">{vistoria.condicao_motor || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Nº Chassi</p>
              <p className="font-medium">{vistoria.numero_chassi || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Condição Chassi</p>
              <p className="font-medium">{vistoria.condicao_chassi || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Município</p>
              <p className="font-medium">{vistoria.municipio || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">UF</p>
              <p className="font-medium">{vistoria.uf || 'N/A'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
