
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInspections } from '@/contexts/InspectionContext';
import { cn } from '@/lib/utils';

const InspectionsList: React.FC = () => {
  const { inspections, deleteInspection } = useInspections();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = searchQuery === '' || 
      inspection.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    const matchesState = stateFilter === 'all' || inspection.state === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

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

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta inspeção?')) {
      deleteInspection(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inspeções</h1>
          <p className="text-slate-600 mt-2">Gerencie todas as inspeções de veículos</p>
        </div>
        
        <Link to="/inspections/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Inspeção
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por placa, marca, modelo ou proprietário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="auctioned">Leiloado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="SP">SP</SelectItem>
                <SelectItem value="RJ">RJ</SelectItem>
                <SelectItem value="MG">MG</SelectItem>
                <SelectItem value="RS">RS</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Veículo</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Proprietário</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Localização</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Data Inspeção</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Restrições</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.map((inspection) => (
                <tr key={inspection.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{inspection.licensePlate}</p>
                      <p className="text-sm text-slate-600">
                        {inspection.brand} {inspection.model} {inspection.modelYear}
                      </p>
                      <p className="text-xs text-slate-500">{inspection.color}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{inspection.owner.name}</p>
                      <p className="text-sm text-slate-600">{inspection.owner.cpf}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-sm text-slate-900">{inspection.city}, {inspection.state}</p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-sm text-slate-900">
                      {new Date(inspection.inspectionDate).toLocaleDateString('pt-BR')}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <Badge className={cn('text-xs', getStatusColor(inspection.status))}>
                      {getStatusLabel(inspection.status)}
                    </Badge>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      {inspection.judicialRestrictions && (
                        <Badge variant="destructive" className="text-xs">Judicial</Badge>
                      )}
                      {inspection.administrativeRestrictions && (
                        <Badge variant="destructive" className="text-xs">Administrativa</Badge>
                      )}
                      {inspection.stolenOrRobbed && (
                        <Badge variant="destructive" className="text-xs">Furto/Roubo</Badge>
                      )}
                      {!inspection.judicialRestrictions && 
                       !inspection.administrativeRestrictions && 
                       !inspection.stolenOrRobbed && (
                        <span className="text-xs text-green-600">Sem restrições</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(inspection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredInspections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhuma inspeção encontrada.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InspectionsList;
