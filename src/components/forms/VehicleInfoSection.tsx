
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { VistoriaFormData } from '@/types/vistoria';

interface VehicleInfoSectionProps {
  control: Control<VistoriaFormData>;
}

const VehicleInfoSection: React.FC<VehicleInfoSectionProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
          name="tipo_veiculo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Veículo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="automovel">Automóvel</SelectItem>
                  <SelectItem value="motocicleta">Motocicleta</SelectItem>
                  <SelectItem value="caminhao">Caminhão</SelectItem>
                  <SelectItem value="onibus">Ônibus</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="caminhonete">Caminhonete</SelectItem>
                  <SelectItem value="microonibus">Microônibus</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
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
          control={control}
          name="motor_alterado"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Motor Alterado?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="motor_sim" />
                    <Label htmlFor="motor_sim">SIM</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="motor_nao" />
                    <Label htmlFor="motor_nao">NÃO</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
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
                  <SelectItem value="motor_original">Motor com características originais</SelectItem>
                  <SelectItem value="numeracao_ilegivel">Numeração do motor ilegível ou danificada</SelectItem>
                  <SelectItem value="motor_nao_cadastrado">Motor não cadastrado na base nacional</SelectItem>
                  <SelectItem value="numeracao_divergente">Numeração do motor divergente da base nacional do veículo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
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
          control={control}
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
                  <SelectItem value="chassi_integro">Chassi íntegro, original, legível e registrado</SelectItem>
                  <SelectItem value="numeracao_ilegivel_avariada">Numeração ilegível ou avariada</SelectItem>
                  <SelectItem value="numeracao_ausente">Numeração ausente ou não localizada</SelectItem>
                  <SelectItem value="suspeita_adulteracao">Suspeita de adulteração</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default VehicleInfoSection;
