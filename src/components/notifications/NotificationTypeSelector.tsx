
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, User, Building2, Users } from 'lucide-react';
import { NotificationRecipient } from '@/types/notification';
import { Vistoria } from '@/types/vistoria';

interface NotificationTypeSelectorProps {
  vistoria: Vistoria;
  onGenerateNotification: (recipientType: NotificationRecipient) => void;
}

export const NotificationTypeSelector: React.FC<NotificationTypeSelectorProps> = ({
  vistoria,
  onGenerateNotification
}) => {
  const [selectedRecipient, setSelectedRecipient] = React.useState<NotificationRecipient>('proprietario');

  const recipientOptions = [
    {
      value: 'proprietario' as NotificationRecipient,
      label: 'Proprietário',
      icon: User,
      available: !!vistoria.nome_proprietario,
      name: vistoria.nome_proprietario
    },
    {
      value: 'financeira' as NotificationRecipient,
      label: 'Financeira',
      icon: Building2,
      available: !!vistoria.nome_financeira,
      name: vistoria.nome_financeira
    },
    {
      value: 'possuidor' as NotificationRecipient,
      label: 'Possuidor',
      icon: Users,
      available: !!vistoria.nome_possuidor,
      name: vistoria.nome_possuidor
    }
  ];

  const availableRecipients = recipientOptions.filter(option => option.available);

  const handleGenerate = () => {
    onGenerateNotification(selectedRecipient);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gerar Notificação de Apreensão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Selecione o destinatário da notificação:
          </label>
          <Select value={selectedRecipient} onValueChange={(value) => setSelectedRecipient(value as NotificationRecipient)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o destinatário" />
            </SelectTrigger>
            <SelectContent>
              {availableRecipients.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">({option.name})</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {availableRecipients.length === 0 && (
          <div className="text-sm text-muted-foreground p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            Nenhum destinatário disponível. Verifique se os dados de proprietário, financeira ou possuidor foram preenchidos na vistoria.
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Dados do Veículo:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Placa:</strong> {vistoria.placa || 'N/A'}</p>
            <p><strong>Marca/Modelo:</strong> {vistoria.marca || 'N/A'}/{vistoria.modelo || 'N/A'}</p>
            <p><strong>Chassi:</strong> {vistoria.numero_chassi || 'N/A'}</p>
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          className="w-full"
          disabled={availableRecipients.length === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          Gerar Notificação
        </Button>
      </CardContent>
    </Card>
  );
};
