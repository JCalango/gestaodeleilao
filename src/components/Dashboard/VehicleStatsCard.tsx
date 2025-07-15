
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Building } from 'lucide-react';
import { Vistoria } from '@/types/vistoria';

interface VehicleStatsCardProps {
  vistorias: Vistoria[];
}

const VehicleStatsCard: React.FC<VehicleStatsCardProps> = ({ vistorias }) => {
  // Count unique brands
  const marcas = new Set(vistorias.filter(v => v.marca).map(v => v.marca)).size;
  
  // Count unique municipalities
  const municipios = new Set(vistorias.filter(v => v.municipio).map(v => v.municipio)).size;
  
  // Count unique UFs
  const ufs = new Set(vistorias.filter(v => v.uf).map(v => v.uf)).size;

  // Count vehicle types
  const tiposVeiculo = vistorias.reduce((acc, v) => {
    if (v.tipo_veiculo) {
      acc[v.tipo_veiculo] = (acc[v.tipo_veiculo] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topTipoVeiculo = Object.entries(tiposVeiculo)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas dos Veículos</CardTitle>
        <CardDescription>Distribuição por características</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Car className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-900">{marcas}</div>
            <div className="text-xs text-blue-700">Marcas</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <MapPin className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-900">{municipios}</div>
            <div className="text-xs text-green-700">Municípios</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Building className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-900">{ufs}</div>
            <div className="text-xs text-purple-700">Estados</div>
          </div>
        </div>

        {topTipoVeiculo.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Tipos de Veículo mais comuns:</h4>
            <div className="space-y-2">
              {topTipoVeiculo.map(([tipo, count]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">{tipo}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleStatsCard;
