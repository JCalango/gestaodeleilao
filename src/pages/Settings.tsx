
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Upload, Save, User } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { settings, updateSetting, uploadLogo, isLoading } = useSystemSettings();
  const [presidenteName, setPresidenteName] = useState('');

  useEffect(() => {
    const presidente = settings.find(s => s.setting_key === 'presidente_comissao_leilao');
    if (presidente) {
      setPresidenteName(presidente.setting_value || '');
    }
  }, [settings]);

  const handlePresidenteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSetting('presidente_comissao_leilao', presidenteName);
      toast({
        title: "Sucesso",
        description: "Nome do presidente atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar nome do presidente",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = async (type: 'prefeitura' | 'smtran', file: File) => {
    try {
      await uploadLogo(type, file);
      toast({
        title: "Sucesso",
        description: `Logo da ${type === 'prefeitura' ? 'Prefeitura' : 'SMTRAN'} atualizado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do logo",
        variant: "destructive",
      });
    }
  };

  const prefeituraLogo = settings.find(s => s.setting_key === 'prefeitura_logo')?.setting_value;
  const smtranLogo = settings.find(s => s.setting_key === 'smtran_logo')?.setting_value;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-blue-800">
            <SettingsIcon className="w-8 h-8 text-blue-600" />
            Configurações do Sistema
          </h1>
          <p className="text-blue-600 mt-2">
            Configure os logos e informações do sistema de leilão
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logos do Sistema */}
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="text-blue-800">Logos Institucionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Logo da Prefeitura */}
            <div>
              <Label htmlFor="prefeitura-logo" className="text-sm font-medium text-blue-700">
                Logo da Prefeitura de Guanambi
              </Label>
              <div className="mt-2 space-y-2">
                {prefeituraLogo && (
                  <div className="w-32 h-32 border-2 border-blue-200 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                    <img
                      src={prefeituraLogo}
                      alt="Logo da Prefeitura"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <Input
                  id="prefeitura-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleLogoUpload('prefeitura', file);
                    }
                  }}
                  disabled={isLoading}
                  className="border-blue-200 focus:border-blue-400"
                />
                <p className="text-xs text-blue-600">
                  Recomendado: PNG ou JPG, máximo 2MB
                </p>
              </div>
            </div>

            {/* Logo da SMTRAN */}
            <div>
              <Label htmlFor="smtran-logo" className="text-sm font-medium text-blue-700">
                Logo da SMTRAN
              </Label>
              <div className="mt-2 space-y-2">
                {smtranLogo && (
                  <div className="w-32 h-32 border-2 border-blue-200 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                    <img
                      src={smtranLogo}
                      alt="Logo da SMTRAN"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <Input
                  id="smtran-logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleLogoUpload('smtran', file);
                    }
                  }}
                  disabled={isLoading}
                  className="border-blue-200 focus:border-blue-400"
                />
                <p className="text-xs text-blue-600">
                  Recomendado: PNG ou JPG, máximo 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <User className="w-5 h-5 text-blue-600" />
              Configurações de Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePresidenteSubmit} className="space-y-4">
              <div>
                <Label htmlFor="presidente" className="text-sm font-medium text-blue-700">
                  Nome do Presidente da Comissão de Leilão
                </Label>
                <Input
                  id="presidente"
                  type="text"
                  value={presidenteName}
                  onChange={(e) => setPresidenteName(e.target.value)}
                  placeholder="Digite o nome completo do presidente"
                  className="mt-2 border-blue-200 focus:border-blue-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-blue-600 mt-1">
                  Este nome aparecerá nas notificações de apreensão como assinatura
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
