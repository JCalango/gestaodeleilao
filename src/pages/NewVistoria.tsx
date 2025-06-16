
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { useVistorias } from '@/contexts/VistoriaContext';
import { VistoriaFormData } from '@/types/vistoria';

const NewVistoria: React.FC = () => {
  const navigate = useNavigate();
  const { addVistoria } = useVistorias();
  
  const form = useForm<VistoriaFormData>({
    defaultValues: {
      numero_controle: '',
      data_inspecao: new Date().toISOString(),
      furto_roubo: false,
      restricao_judicial: false,
      restricao_administrativa: false,
      alienacao_fiduciaria: false,
      possui_comunicacao_venda: false,
    },
  });

  const onSubmit = (data: VistoriaFormData) => {
    console.log('Form submitted:', data);
    addVistoria(data);
    navigate('/inspections');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/inspections')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nova Vistoria</h1>
          <p className="text-slate-600 mt-2">Cadastre uma nova vistoria de veículo</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados básicos da vistoria</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero_controle"
                rules={{ required: "Número de controle é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Controle *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: CTL001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="data_inspecao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Inspeção</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Informações do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corolla" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="renavam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RENAVAM</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12345678901" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Branco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ano_fabricacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano de Fabricação</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 2020" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ano_modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano do Modelo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 2020" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Município</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo_combustivel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustível</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o combustível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gasolina">Gasolina</SelectItem>
                        <SelectItem value="etanol">Etanol</SelectItem>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="gnv">GNV</SelectItem>
                        <SelectItem value="eletrico">Elétrico</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Particular" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero_motor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Motor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: ABC123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condicao_motor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condição do Motor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a condição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bom">Bom</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="ruim">Ruim</SelectItem>
                        <SelectItem value="inoperante">Inoperante</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero_chassi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Chassi</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 9BGXXX123XXX45678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="condicao_chassi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condição do Chassi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a condição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="integro">Íntegro</SelectItem>
                        <SelectItem value="danificado">Danificado</SelectItem>
                        <SelectItem value="corroido">Corroído</SelectItem>
                        <SelectItem value="ilegivel">Ilegível</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Restrições */}
          <Card>
            <CardHeader>
              <CardTitle>Restrições e Situação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="furto_roubo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Furto/Roubo</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="restricao_judicial"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Restrição Judicial</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="restricao_administrativa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Restrição Administrativa</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="alienacao_fiduciaria"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Alienação Fiduciária</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite observações sobre o veículo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Informações do Proprietário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Proprietário</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nome_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Proprietário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cpf_cnpj_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ do Proprietário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123.456.789-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço do Proprietário</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua das Flores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero_casa_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número da Casa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="complemento_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apto 45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cep_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 01234-567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cidade_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bairro_proprietario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="informacoes_complementares_proprietario"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-3">
                    <FormLabel>Informações Complementares</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais sobre o proprietário..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Informações de Débitos do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Débitos do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ipva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPVA</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Em dia / Pendente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="licenciamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licenciamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 2024 / Pendente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="data_entrada_patio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Entrada no Pátio</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="debito_patio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Débito do Pátio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 1500.00" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="infracoes_transito"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-2">
                    <FormLabel>Infrações de Trânsito</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as infrações de trânsito..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dados_remocao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 lg:col-span-3">
                    <FormLabel>Dados de Remoção</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações sobre a remoção do veículo..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Comunicação de Venda */}
          <Card>
            <CardHeader>
              <CardTitle>Comunicação de Venda</CardTitle>
              <CardDescription>Informações sobre possível comunicação de venda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="possui_comunicacao_venda"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Veículo possui comunicação de venda?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {form.watch('possui_comunicacao_venda') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="nome_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Maria Santos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpf_cnpj_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 987.654.321-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endereco_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Av. Principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cep_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 01234-567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cidade_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Rio de Janeiro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bairro_possuidor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro do Possuidor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Copacabana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="informacoes_complementares_possuidor"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel>Informações Complementares do Possuidor</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informações adicionais sobre o possuidor..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações da Financeira */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Financeira</CardTitle>
              <CardDescription>Em caso de veículo possuir comunicação de venda</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nome_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Banco Financeiro S.A." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cnpj_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 12.345.678/0001-90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endereco_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Rua Comercial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numero_endereco_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bairro_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Centro Comercial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="complemento_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sala 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cep_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 01234-567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cidade_financeira"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade da Financeira</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Fotos do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos do Veículo</CardTitle>
              <CardDescription>Upload das fotos necessárias para a vistoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos da Frente</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos Lateral Esquerda</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos Lateral Direita</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos do Chassi</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos da Traseira</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fotos do Motor</label>
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer"
                  />
                </div>
              </div>
              
              <p className="text-sm text-slate-500">
                * Selecione múltiplas fotos para cada categoria. Formatos aceitos: JPG, PNG, WebP
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inspections')}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Vistoria
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewVistoria;
