
import React from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VistoriaFormData } from '@/types/vistoria';

interface FinancialInfoSectionProps {
  control: Control<VistoriaFormData>;
}

const FinancialInfoSection: React.FC<FinancialInfoSectionProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Financeira</CardTitle>
        <CardDescription>Em caso de veículo possuir comunicação de venda</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default FinancialInfoSection;
