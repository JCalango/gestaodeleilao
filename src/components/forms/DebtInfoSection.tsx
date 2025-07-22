
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VistoriaFormData } from '@/types/vistoria';

interface DebtInfoSectionProps {
  control: Control<VistoriaFormData>;
}

const DebtInfoSection: React.FC<DebtInfoSectionProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações de Débitos do Veículo</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default DebtInfoSection;
