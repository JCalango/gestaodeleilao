
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatCard from '@/components/Dashboard/StatCard';
import VehicleStatsCard from '@/components/Dashboard/VehicleStatsCard';
import RestrictionStatsCard from '@/components/Dashboard/RestrictionStatsCard';
import RecentInspections from '@/components/Dashboard/RecentInspections';
import ActiveUsersCard from '@/components/users/ActiveUsersCard';
import { useVistorias } from '@/contexts/VistoriaContext';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { vistorias, isLoading } = useVistorias();
  const { logUserActivity } = useActiveUsers();

  useEffect(() => {
    // Log da atividade de visualização do dashboard
    logUserActivity('dashboard_view', 'Usuário acessou o dashboard');
  }, [logUserActivity]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Estatísticas básicas
  const totalVistorias = vistorias.length;
  const vistoriasHoje = vistorias.filter(v => 
    v.data_inspecao && 
    new Date(v.data_inspecao).toDateString() === new Date().toDateString()
  ).length;
  
  const vistoriasComRestricao = vistorias.filter(v => 
    v.restricao_judicial || v.restricao_administrativa || v.furto_roubo
  ).length;

  const vistoriasSemRestricao = totalVistorias - vistoriasComRestricao;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Visão geral do sistema de vistorias</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vistorias"
          value={totalVistorias}
          icon={FileText}
          description="Vistorias cadastradas"
        />
        <StatCard
          title="Vistorias Hoje"
          value={vistoriasHoje}
          icon={Calendar}
          description="Realizadas hoje"
          trend={vistoriasHoje > 0 ? "up" : undefined}
        />
        <StatCard
          title="Com Restrições"
          value={vistoriasComRestricao}
          icon={AlertTriangle}
          description="Veículos com restrições"
          variant="warning"
        />
        <StatCard
          title="Sem Restrições"
          value={vistoriasSemRestricao}
          icon={CheckCircle}
          description="Veículos liberados"
          variant="success"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VehicleStatsCard vistorias={vistorias} />
        <RestrictionStatsCard vistorias={vistorias} />
      </div>

      {/* Recent Activity and Active Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentInspections vistorias={vistorias.slice(0, 10)} />
        </div>
        <div>
          <ActiveUsersCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
