
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Vistoria } from '@/types/vistoria';

interface RecentInspectionsProps {
  inspections: Vistoria[];
  isLoading: boolean;
}

const RecentInspections: React.FC<RecentInspectionsProps> = ({ inspections, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vistorias Recentes</CardTitle>
          <CardDescription>Últimas vistorias realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vistorias Recentes</CardTitle>
        <CardDescription>Últimas vistorias realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">Nenhuma vistoria encontrada</p>
              <Link to="/inspections/new">
                <Button>Criar primeira vistoria</Button>
              </Link>
            </div>
          ) : (
            inspections.map((inspection) => (
              <div key={inspection.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-slate-900">
                        {inspection.placa || 'Placa não informada'}
                      </h4>
                      {inspection.restricao_judicial && (
                        <Badge variant="destructive" className="text-xs">Judicial</Badge>
                      )}
                      {inspection.restricao_administrativa && (
                        <Badge variant="destructive" className="text-xs">Admin</Badge>
                      )}
                      {inspection.furto_roubo && (
                        <Badge variant="destructive" className="text-xs">Furto</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-1">
                      {inspection.marca} {inspection.modelo} - {inspection.cor}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {inspection.data_inspecao 
                          ? new Date(inspection.data_inspecao).toLocaleDateString('pt-BR')
                          : 'Data não informada'
                        }
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {inspection.municipio}, {inspection.uf}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
          
          {inspections.length > 0 && (
            <div className="pt-4 border-t">
              <Link to="/inspections">
                <Button variant="outline" className="w-full">
                  Ver todas as vistorias
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInspections;
