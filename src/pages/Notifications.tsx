
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Bell } from 'lucide-react';
import { useVistorias } from '@/contexts/VistoriaContext';
import { NotificationTypeSelector } from '@/components/notifications/NotificationTypeSelector';
import { generateNotificationPDF } from '@/utils/notificationPdfGenerator';
import { NotificationRecipient } from '@/types/notification';
import { toast } from '@/hooks/use-toast';

const Notifications = () => {
  const { vistorias, isLoading } = useVistorias();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVistoriaId, setSelectedVistoriaId] = useState<string | null>(null);

  const filteredVistorias = vistorias.filter(vistoria =>
    vistoria.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vistoria.numero_controle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vistoria.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vistoria.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVistoria = selectedVistoriaId 
    ? vistorias.find(v => v.id === selectedVistoriaId)
    : null;

  const handleGenerateNotification = async (recipientType: NotificationRecipient) => {
    if (!selectedVistoria) {
      toast({
        title: "Erro",
        description: "Nenhuma vistoria selecionada",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateNotificationPDF(selectedVistoria, recipientType);
      toast({
        title: "Sucesso",
        description: "Notificação gerada com sucesso!",
      });
    } catch (error) {
      console.error('Error generating notification:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar notificação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Notificações
          </h1>
          <p className="text-muted-foreground">
            Gere notificações de apreensão para proprietários, financeiras e possuidores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Vistorias */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Vistoria</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por placa, número de controle, marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">Carregando vistorias...</div>
              ) : filteredVistorias.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchTerm ? 'Nenhuma vistoria encontrada' : 'Nenhuma vistoria cadastrada'}
                </div>
              ) : (
                filteredVistorias.map((vistoria) => (
                  <div
                    key={vistoria.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVistoriaId === vistoria.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVistoriaId(vistoria.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {vistoria.placa || 'Sem placa'} - {vistoria.marca} {vistoria.modelo}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Controle: {vistoria.numero_controle}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Proprietário: {vistoria.nome_proprietario || 'N/A'}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vistoria.created_at 
                          ? new Date(vistoria.created_at).toLocaleDateString('pt-BR')
                          : ''
                        }
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gerador de Notificação */}
        <div>
          {selectedVistoria ? (
            <NotificationTypeSelector
              vistoria={selectedVistoria}
              onGenerateNotification={handleGenerateNotification}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Selecione uma Vistoria</h3>
                  <p className="text-muted-foreground">
                    Escolha uma vistoria da lista ao lado para gerar a notificação de apreensão
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
