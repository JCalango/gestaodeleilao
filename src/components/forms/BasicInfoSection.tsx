
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VistoriaFormData } from '@/types/vistoria';

interface BasicInfoSectionProps {
  control: Control<VistoriaFormData>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Dados básicos da vistoria</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
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
          control={control}
          name="data_inspecao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Inspeção</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field}
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
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

export default BasicInfoSection;
