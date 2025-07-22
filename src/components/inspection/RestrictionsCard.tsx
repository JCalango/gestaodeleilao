
import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vistoria } from '@/types/vistoria';

interface RestrictionsCardProps {
  vistoria: Vistoria;
}

const RestrictionsCard: React.FC<RestrictionsCardProps> = ({ vistoria }) => {
  const hasRestrictions = vistoria.restricao_judicial || 
                         vistoria.restricao_administrativa || 
                         vistoria.furto_roubo || 
                         vistoria.alienacao_fiduciaria;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasRestrictions ? (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          Restrições
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasRestrictions ? (
          <div className="space-y-3">
            {vistoria.restricao_judicial && (
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Restrição Judicial</span>
                <Badge variant="destructive">Sim</Badge>
              </div>
            )}
            
            {vistoria.restricao_administrativa && (
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Restrição Administrativa</span>
                <Badge variant="destructive">Sim</Badge>
              </div>
            )}
            
            {vistoria.furto_roubo && (
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Furto/Roubo</span>
                <Badge variant="destructive">Sim</Badge>
              </div>
            )}
            
            {vistoria.alienacao_fiduciaria && (
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Alienação Fiduciária</span>
                <Badge variant="destructive">Sim</Badge>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">Nenhuma restrição encontrada</p>
            <p className="text-slate-500 text-sm">O veículo não possui restrições ativas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestrictionsCard;
