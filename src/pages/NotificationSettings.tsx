import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useToast } from '@/hooks/use-toast';
import { FileText, Printer, Save } from 'lucide-react';

const NotificationSettings = () => {
  const { getSetting, updateSetting, isUpdating } = useSystemSettings();
  const [notificationText, setNotificationText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedText = getSetting('notification_text');
    if (savedText) {
      setNotificationText(savedText);
    }
  }, [getSetting]);

  const handleSave = async () => {
    try {
      await updateSetting('notification_text', notificationText);
      toast({
        title: "Sucesso",
        description: "Texto da notificação atualizado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar o texto da notificação.",
        variant: "destructive",
      });
    }
  };

  const handlePrintVersion = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Notificação de Apreensão de Veículo</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.5;
              margin: 0;
              padding: 0;
              background: white;
            }
            .envelope-format {
              width: 210mm;
              height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              box-sizing: border-box;
              page-break-after: always;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
            }
            .logo-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            .title {
              font-size: 16pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 10px 0;
            }
            .subtitle {
              font-size: 14pt;
              margin-bottom: 5px;
            }
            .sender-info {
              text-align: center;
              margin-bottom: 30px;
              font-size: 11pt;
            }
            .recipient-section {
              margin-bottom: 30px;
            }
            .recipient-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .recipient-box {
              border: 1px solid #000;
              padding: 15px;
              min-height: 60px;
              background: #f9f9f9;
            }
            .notification-content {
              margin-bottom: 30px;
              text-align: justify;
              text-indent: 2em;
            }
            .vehicle-info {
              border: 1px solid #000;
              padding: 15px;
              margin: 20px 0;
              background: #f5f5f5;
            }
            .vehicle-info h4 {
              margin: 0 0 10px 0;
              font-weight: bold;
              text-decoration: underline;
            }
            .signature-section {
              margin-top: 50px;
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #000;
              width: 300px;
              margin: 50px auto 10px;
            }
            .footer {
              position: absolute;
              bottom: 20mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              font-size: 10pt;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            @media print {
              .envelope-format {
                margin: 0;
                box-shadow: none;
              }
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="envelope-format">
            <div class="header">
              <div class="logo-section">
                <div>PREFEITURA MUNICIPAL</div>
                <div>SMTRAN</div>
              </div>
              <div class="title">Notificação de Apreensão de Veículo</div>
              <div class="subtitle">Superintendência de Trânsito de Guanambi</div>
            </div>

            <div class="sender-info">
              <strong>REMETENTE:</strong><br>
              Superintendência de Trânsito de Guanambi - SMTRAN-GBI<br>
              Av. Joaquim Chaves, nº 401, B. Santo Antônio<br>
              Guanambi - Bahia, CEP: [CEP]<br>
              Telefone: (77) 98802-9862
            </div>

            <div class="recipient-section">
              <div class="recipient-label">DESTINATÁRIO:</div>
              <div class="recipient-box">
                [NOME DO DESTINATÁRIO]<br>
                [ENDEREÇO COMPLETO]<br>
                [CIDADE - UF, CEP]
              </div>
            </div>

            <div class="notification-content">
              ${notificationText.replace(/\n/g, '<br><br>')}
            </div>

            <div class="vehicle-info">
              <h4>DADOS DO VEÍCULO APREENDIDO:</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px; border: 1px solid #ccc;"><strong>Placa:</strong> [PLACA]</td>
                  <td style="padding: 5px; border: 1px solid #ccc;"><strong>UF:</strong> [UF]</td>
                </tr>
                <tr>
                  <td style="padding: 5px; border: 1px solid #ccc;"><strong>Marca:</strong> [MARCA]</td>
                  <td style="padding: 5px; border: 1px solid #ccc;"><strong>Modelo:</strong> [MODELO]</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 5px; border: 1px solid #ccc;"><strong>Chassi:</strong> [CHASSI]</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 5px; border: 1px solid #ccc;"><strong>Data da Apreensão:</strong> [DATA_APREENSAO]</td>
                </tr>
              </table>
            </div>

            <div class="signature-section">
              <div class="signature-line"></div>
              <div>
                <strong>[NOME DO PRESIDENTE]</strong><br>
                Presidente da Comissão de Leilão<br>
                SMTRAN-GBI
              </div>
              <div style="margin-top: 20px;">
                <strong>Data:</strong> ___/___/______
              </div>
            </div>

            <div class="footer">
              <strong>IMPORTANTE:</strong> Esta notificação deve ser respondida no prazo de 30 (trinta) dias.<br>
              Em caso de dúvidas, entre em contato através dos meios informados acima.
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações de Notificações</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Texto da Notificação de Apreensão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Conteúdo da carta de notificação:
              </label>
              <Textarea
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                placeholder="Digite o texto da notificação..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handlePrintVersion}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Visualizar Versão para Impressão
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções para Impressão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Versão para Impressão:</strong> A versão gerada é formatada especificamente 
                para impressão em papel A4 e envio pelos Correios.
              </p>
              <p>
                <strong>Campos de Dados:</strong> Os campos marcados com [NOME_DO_CAMPO] serão 
                automaticamente preenchidos com os dados da vistoria selecionada ao gerar 
                a notificação final.
              </p>
              <p>
                <strong>Formatação:</strong> O layout inclui espaços para remetente, destinatário, 
                dados do veículo e assinatura, seguindo o padrão oficial para correspondências.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;