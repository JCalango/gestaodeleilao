
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Shield, ShieldAlert } from 'lucide-react';
import { Vistoria } from '@/types/vistoria';

interface RestrictionStatsCardProps {
  vistorias: Vistoria[];
}

const RestrictionStatsCard: React.FC<RestrictionStatsCardProps> = ({ vistorias }) => {
  const semRestricoes = vistorias.filter(v => 
    !v.restricao_judicial && !v.restricao_administrativa && !v.furto_roubo
  ).length;

  const restricaoAdministrativa = vistorias.filter(v => 
    v.restricao_administrativa && !v.restricao_judicial && !v.furto_roubo
  ).length;

  const restricaoJudicial = vistorias.filter(v => 
    v.restricao_judicial || v.furto_roubo
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status das Restrições</CardTitle>
        <CardDescription>Distribuição por tipo de restrição</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Sem Restrições</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            {semRestricoes}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Restrição Administrativa</span>
          </div>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            {restricaoAdministrativa}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Restrição Judicial</span>
          </div>
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            {restricaoJudicial}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestrictionStatsCard;
