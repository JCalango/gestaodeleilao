
import React from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vistoria } from '@/types/vistoria';

interface DebtsInfoCardProps {
  vistoria: Vistoria;
}

const DebtsInfoCard: React.FC<DebtsInfoCardProps> = ({ vistoria }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Informações de Débitos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">IPVA</p>
            <p className="font-medium">{vistoria.ipva || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Licenciamento</p>
            <p className="font-medium">{vistoria.licenciamento || 'N/A'}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-600">Infrações de Trânsito</p>
          <p className="font-medium">{vistoria.infracoes_transito || 'N/A'}</p>
        </div>
        
        <div className="pt-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Data Entrada Pátio</p>
              <p className="font-medium">
                {vistoria.data_entrada_patio 
                  ? new Date(vistoria.data_entrada_patio).toLocaleDateString('pt-BR')
                  : 'N/A'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Débito Pátio</p>
              <p className="font-medium">
                {vistoria.debito_patio 
                  ? `R$ ${Number(vistoria.debito_patio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
        
        {vistoria.dados_remocao && (
          <div className="pt-3 border-t">
            <p className="text-sm text-slate-600">Dados de Remoção</p>
            <p className="font-medium">{vistoria.dados_remocao}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebtsInfoCard;
