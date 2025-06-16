
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VistoriaFormData } from '@/types/vistoria';

interface SaleInfoSectionProps {
  control: Control<VistoriaFormData>;
}

const SaleInfoSection: React.FC<SaleInfoSectionProps> = ({ control }) => {
  const possuiComunicacaoVenda = useWatch({
    control,
    name: 'possui_comunicacao_venda',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comunicação de Venda</CardTitle>
        <CardDescription>Informações sobre possível comunicação de venda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
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
        
        {possuiComunicacaoVenda && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            <FormField
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
  );
};

export default SaleInfoSection;
