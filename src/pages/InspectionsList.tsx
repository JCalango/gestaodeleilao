
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, Filter, Download, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVistorias } from '@/contexts/VistoriaContext';
import { cn } from '@/lib/utils';

const InspectionsList: React.FC = () => {
  const { vistorias, isLoading, deleteVistoria } = useVistorias();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');

  const filteredVistorias = vistorias.filter(vistoria => {
    const matchesSearch = searchQuery === '' || 
      (vistoria.placa && vistoria.placa.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.marca && vistoria.marca.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.modelo && vistoria.modelo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.nome_proprietario && vistoria.nome_proprietario.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesState = stateFilter === 'all' || vistoria.uf === stateFilter;
    
    return matchesSearch && matchesState;
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vistoria?')) {
      deleteVistoria(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vistorias</h1>
          <p className="text-slate-600 mt-2">Gerencie todas as vistorias de veículos</p>
        </div>
        
        <Link to="/inspections/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Vistoria
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
                <SelectItem value="PR">PR</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
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
                <th className="text-left py-3 px-4 font-medium text-slate-700">Data Vistoria</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Restrições</th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVistorias.map((vistoria) => (
                <tr key={vistoria.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{vistoria.placa || 'N/A'}</p>
                      <p className="text-sm text-slate-600">
                        {vistoria.marca} {vistoria.modelo} {vistoria.ano_modelo}
                      </p>
                      <p className="text-xs text-slate-500">{vistoria.cor}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{vistoria.nome_proprietario || 'N/A'}</p>
                      <p className="text-sm text-slate-600">{vistoria.cpf_cnpj_proprietario}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-sm text-slate-900">{vistoria.municipio}, {vistoria.uf}</p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-sm text-slate-900">
                      {vistoria.data_inspecao ? new Date(vistoria.data_inspecao).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      {vistoria.restricao_judicial && (
                        <Badge variant="destructive" className="text-xs">Judicial</Badge>
                      )}
                      {vistoria.restricao_administrativa && (
                        <Badge variant="destructive" className="text-xs">Administrativa</Badge>
                      )}
                      {vistoria.furto_roubo && (
                        <Badge variant="destructive" className="text-xs">Furto/Roubo</Badge>
                      )}
                      {!vistoria.restricao_judicial && 
                       !vistoria.restricao_administrativa && 
                       !vistoria.furto_roubo && (
                        <span className="text-xs text-green-600">Sem restrições</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/inspections/${vistoria.id}`}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 text-blue-600 hover:text-blue-700"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Link to={`/inspections/${vistoria.id}/damage-assessment`}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 text-orange-600 hover:text-orange-700"
                          title="Avaliação de Avarias"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(vistoria.id)}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredVistorias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhuma vistoria encontrada.</p>
              {vistorias.length === 0 && (
                <Link to="/inspections/new" className="inline-block mt-4">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar primeira vistoria
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InspectionsList;
