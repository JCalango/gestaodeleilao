
import React from 'react';
import { Car, FileText, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';
import RecentInspections from '@/components/Dashboard/RecentInspections';
import { useInspections } from '@/contexts/InspectionContext';

const Dashboard: React.FC = () => {
  const { inspections } = useInspections();

  const totalInspections = inspections.length;
  const pendingInspections = inspections.filter(i => i.status === 'pending').length;
  const approvedInspections = inspections.filter(i => i.status === 'approved').length;
  const withRestrictions = inspections.filter(i => 
    i.judicialRestrictions || i.administrativeRestrictions || i.stolenOrRobbed
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Visão geral da gestão de leilões</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Inspeções"
          value={totalInspections}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Pendentes"
          value={pendingInspections}
          icon={Clock}
          color="yellow"
          trend={{ value: 5, isPositive: false }}
        />
        
        <StatCard
          title="Aprovadas"
          value={approvedInspections}
          icon={CheckCircle}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Com Restrições"
          value={withRestrictions}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInspections />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Nova Inspeção</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Gerar Relatório</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Iniciar Leilão</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Alertas</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>3 inspeções</strong> precisam de atenção
                </p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>1 veículo</strong> com restrição judicial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
