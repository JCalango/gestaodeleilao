
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vistoria } from '@/types/vistoria';

interface OwnerInfoCardProps {
  vistoria: Vistoria;
}

const OwnerInfoCard: React.FC<OwnerInfoCardProps> = ({ vistoria }) => {
  const hasOwnerInfo = vistoria.nome_proprietario || vistoria.cpf_cnpj_proprietario;
  const hasPossessorInfo = vistoria.nome_possuidor || vistoria.cpf_cnpj_possuidor;
  const hasFinancialInfo = vistoria.nome_financeira || vistoria.cnpj_financeira;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações das Pessoas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="owner">Proprietário</TabsTrigger>
            <TabsTrigger value="possessor">Possuidor</TabsTrigger>
            <TabsTrigger value="financial">Financeira</TabsTrigger>
          </TabsList>
          
          <TabsContent value="owner" className="space-y-3">
            {hasOwnerInfo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nome</p>
                  <p className="font-medium">{vistoria.nome_proprietario || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">CPF/CNPJ</p>
                  <p className="font-medium">{vistoria.cpf_cnpj_proprietario || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Endereço</p>
                  <p className="font-medium">
                    {[
                      vistoria.endereco_proprietario,
                      vistoria.numero_casa_proprietario,
                      vistoria.complemento_proprietario,
                      vistoria.bairro_proprietario,
                      vistoria.cidade_proprietario,
                      vistoria.cep_proprietario
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Nenhuma informação do proprietário cadastrada.</p>
            )}
          </TabsContent>
          
          <TabsContent value="possessor" className="space-y-3">
            {hasPossessorInfo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nome</p>
                  <p className="font-medium">{vistoria.nome_possuidor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">CPF/CNPJ</p>
                  <p className="font-medium">{vistoria.cpf_cnpj_possuidor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Endereço</p>
                  <p className="font-medium">
                    {[
                      vistoria.endereco_possuidor,
                      vistoria.bairro_possuidor,
                      vistoria.cidade_possuidor,
                      vistoria.cep_possuidor
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Nenhuma informação do possuidor cadastrada.</p>
            )}
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-3">
            {hasFinancialInfo ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nome</p>
                  <p className="font-medium">{vistoria.nome_financeira || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">CNPJ</p>
                  <p className="font-medium">{vistoria.cnpj_financeira || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Endereço</p>
                  <p className="font-medium">
                    {[
                      vistoria.endereco_financeira,
                      vistoria.numero_endereco_financeira,
                      vistoria.complemento_financeira,
                      vistoria.bairro_financeira,
                      vistoria.cidade_financeira,
                      vistoria.cep_financeira
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Nenhuma informação da financeira cadastrada.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OwnerInfoCard;
