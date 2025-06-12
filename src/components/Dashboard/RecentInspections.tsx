
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInspections } from '@/contexts/InspectionContext';
import { cn } from '@/lib/utils';

const RecentInspections: React.FC = () => {
  const { inspections } = useInspections();
  const recentInspections = inspections.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'auctioned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'auctioned': return 'Leiloado';
      default: return status;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Inspeções Recentes</h3>
        <Link to="/inspections">
          <Button variant="outline" size="sm">Ver todas</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {recentInspections.map((inspection) => (
          <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <span className="font-bold text-slate-700">
                  {inspection.licensePlate.substring(0, 3)}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900">
                  {inspection.licensePlate} - {inspection.brand} {inspection.model}
                </h4>
                <p className="text-sm text-slate-600">
                  {inspection.owner.name} • {inspection.city}, {inspection.state}
                </p>
                <p className="text-xs text-slate-500">
                  Inspeção: {new Date(inspection.inspectionDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={cn('text-xs', getStatusColor(inspection.status))}>
                {getStatusLabel(inspection.status)}
              </Badge>
              
              <div className="flex gap-1">
                <Link to={`/inspections/${inspection.id}`}>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to={`/inspections/${inspection.id}/edit`}>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentInspections;
