
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, Trash2, Filter, Download, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useVistorias } from '@/contexts/VistoriaContext';
import { cn } from '@/lib/utils';

const InspectionsList: React.FC = () => {
  const { vistorias, isLoading, deleteVistoria } = useVistorias();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [restrictionFilter, setRestrictionFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const uniqueCities = useMemo(() => {
    const cities = vistorias
      .map(v => v.municipio)
      .filter((c): c is string => !!c);
    return [...new Set(cities)].sort();
  }, [vistorias]);

  const uniqueVehicleTypes = useMemo(() => {
    const types = vistorias
      .map(v => v.tipo_veiculo)
      .filter((t): t is string => !!t);
    return [...new Set(types)].sort();
  }, [vistorias]);

  const activeFilterCount = [stateFilter, restrictionFilter, cityFilter, vehicleTypeFilter].filter(f => f !== 'all').length;

  const filteredVistorias = vistorias.filter(vistoria => {
    const matchesSearch = searchQuery === '' || 
      (vistoria.placa && vistoria.placa.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.marca && vistoria.marca.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.modelo && vistoria.modelo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vistoria.nome_proprietario && vistoria.nome_proprietario.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesState = stateFilter === 'all' || vistoria.uf === stateFilter;

    const matchesRestriction = (() => {
      if (restrictionFilter === 'all') return true;
      const hasAny = vistoria.restricao_judicial || vistoria.restricao_administrativa || vistoria.furto_roubo;
      if (restrictionFilter === 'com') return hasAny;
      if (restrictionFilter === 'sem') return !hasAny;
      if (restrictionFilter === 'judicial') return vistoria.restricao_judicial;
      if (restrictionFilter === 'administrativa') return vistoria.restricao_administrativa;
      if (restrictionFilter === 'furto') return vistoria.furto_roubo;
      return true;
    })();

    const matchesCity = cityFilter === 'all' || vistoria.municipio === cityFilter;
    const matchesVehicleType = vehicleTypeFilter === 'all' || vistoria.tipo_veiculo === vehicleTypeFilter;
    
    return matchesSearch && matchesState && matchesRestriction && matchesCity && matchesVehicleType;
  });

  const clearFilters = () => {
    setRestrictionFilter('all');
    setCityFilter('all');
    setVehicleTypeFilter('all');
    setStateFilter('all');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta vistoria?')) {
      deleteVistoria(id);
    }
  };

  const handleEdit = (vistoriaId: string) => {
    navigate(`/edit-vistoria/${vistoriaId}`);
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
        
        <Link to="/new-vistoria">
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

            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-background border z-50" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-foreground">Filtros avançados</h4>
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto py-1 px-2 text-xs text-muted-foreground">
                        <X className="w-3 h-3 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Estado (UF)</Label>
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="AL">AL</SelectItem>
                        <SelectItem value="AP">AP</SelectItem>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="DF">DF</SelectItem>
                        <SelectItem value="ES">ES</SelectItem>
                        <SelectItem value="GO">GO</SelectItem>
                        <SelectItem value="MA">MA</SelectItem>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="MS">MS</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="PB">PB</SelectItem>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="PI">PI</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="RN">RN</SelectItem>
                        <SelectItem value="RS">RS</SelectItem>
                        <SelectItem value="RO">RO</SelectItem>
                        <SelectItem value="RR">RR</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="SE">SE</SelectItem>
                        <SelectItem value="TO">TO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Restrições</Label>
                    <Select value={restrictionFilter} onValueChange={setRestrictionFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="com">Com restrições</SelectItem>
                        <SelectItem value="sem">Sem restrições</SelectItem>
                        <SelectItem value="judicial">Judicial</SelectItem>
                        <SelectItem value="administrativa">Administrativa</SelectItem>
                        <SelectItem value="furto">Furto/Roubo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Localização (Município)</Label>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Tipo de Veículo</Label>
                    <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">Todos</SelectItem>
                        {uniqueVehicleTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                        className="w-8 h-8 text-green-600 hover:text-green-700"
                        onClick={() => handleEdit(vistoria.id)}
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
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
                <Link to="/new-vistoria" className="inline-block mt-4">
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
