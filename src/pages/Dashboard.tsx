
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Car, Users, FileText, AlertCircle } from 'lucide-react';
import { useVistorias } from '@/contexts/VistoriaContext';
import StatCard from '@/components/Dashboard/StatCard';
import RecentInspections from '@/components/Dashboard/RecentInspections';

const Dashboard: React.FC = () => {
  const { vistorias, isLoading } = useVistorias();

  const totalVistorias = vistorias.length;
  const vistoriasComRestricao = vistorias.filter(v => 
    v.restricao_judicial || v.restricao_administrativa || v.furto_roubo
  ).length;
  const vistoriasRecentes = vistorias.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Visão geral das vistorias de veículos</p>
        </div>
        
        <Link to="/inspections/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Vistoria
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vistorias"
          value={totalVistorias}
          icon={Car}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Com Restrições"
          value={vistoriasComRestricao}
          icon={AlertCircle}
          trend={{ value: 3, isPositive: false }}
        />
        
        <StatCard
          title="Este Mês"
          value={vistorias.filter(v => {
            const vistoriaDate = new Date(v.created_at || '');
            const currentDate = new Date();
            return vistoriaDate.getMonth() === currentDate.getMonth() && 
                   vistoriaDate.getFullYear() === currentDate.getFullYear();
          }).length}
          icon={FileText}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Usuários Ativos"
          value={15}
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInspections inspections={vistoriasRecentes} isLoading={isLoading} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às funcionalidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/inspections/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Vistoria
                </Button>
              </Link>
              
              <Link to="/inspections" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Todas as Vistorias
                </Button>
              </Link>
              
              <Link to="/users" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Usuários
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Taxa de Conclusão</span>
                <span className="font-semibold">94%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tempo Médio</span>
                <span className="font-semibold">12 min</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Satisfação</span>
                <span className="font-semibold">4.8/5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
