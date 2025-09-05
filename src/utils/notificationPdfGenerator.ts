import { Vistoria } from '@/types/vistoria';
import { NotificationRecipient } from '@/types/notification';
import { supabase } from '@/integrations/supabase/client';

const getSystemSettings = async () => {
  try {
    console.log('Fetching system settings from database...');
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .in('setting_key', ['prefeitura_logo', 'smtran_logo', 'presidente_comissao_leilao', 'notification_text']);

    if (error) {
      console.error('Error fetching settings:', error);
      return { 
        prefeituraLogo: null, 
        smtranLogo: null, 
        presidenteName: 'Nome do Presidente',
        notificationText: getDefaultNotificationText()
      };
    }

    const prefeituraLogo = settings?.find(s => s.setting_key === 'prefeitura_logo')?.setting_value || null;
    const smtranLogo = settings?.find(s => s.setting_key === 'smtran_logo')?.setting_value || null;
    const presidenteName = settings?.find(s => s.setting_key === 'presidente_comissao_leilao')?.setting_value || 'Nome do Presidente';
    const notificationText = settings?.find(s => s.setting_key === 'notification_text')?.setting_value || getDefaultNotificationText();

    return { prefeituraLogo, smtranLogo, presidenteName, notificationText };
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return { 
      prefeituraLogo: null, 
      smtranLogo: null, 
      presidenteName: 'Nome do Presidente',
      notificationText: getDefaultNotificationText()
    };
  }
};

const getDefaultNotificationText = () => {
  return `A COMISSÃO DE LEILÃO, vinculada à Secretaria de Planejamento da Prefeitura Municipal de Guanambi-Ba, no uso de suas atribuições legais, NOTIFICA Vossa Senhoria, na qualidade de proprietário(a), fiduciário(a) ou responsável legal, que o veículo automotor descrito abaixo encontra-se apreendido e recolhido no depósito desta Superintendência, nos termos do Art. 328 do Código de Trânsito Brasileiro (CTB), alterado pela Lei nº 13.160/2015, e da Resolução nº 623/2016 do Conselho Nacional de Trânsito (CONTRAN).

Dessa forma, orientamos que seja providenciada a regularização do licenciamento do veículo, bem como a quitação dos débitos referentes a remoção, estadia e demais encargos, a fim de possibilitar a restituição do bem.

Após a devida regularização, V. Sa. deverá comparecer, em até 30 (trinta) dias contados desta notificação, ao Setor de Liberação de Veículos, situado na Av. Joaquim Chaves, nº 401, Bairro Santo Antônio, Guanambi/BA, de segunda a sexta-feira, em horário comercial, ou entrar em contato pelo telefone (77) 98802-9862, para tratar da retirada do veículo.

Ressaltamos que o não cumprimento deste prazo implicará na inclusão do referido veículo em processo de alienação por meio de leilão público, conforme a legislação vigente.`;
};

const getRecipientData = (vistoria: Vistoria, recipientType: NotificationRecipient) => {
  switch (recipientType) {
    case 'proprietario':
      return {
        name: vistoria.nome_proprietario || 'N/A',
        address: `${vistoria.endereco_proprietario || ''} ${vistoria.numero_casa_proprietario || ''} ${vistoria.complemento_proprietario || ''}, ${vistoria.bairro_proprietario || ''}, ${vistoria.cidade_proprietario || ''} - CEP: ${vistoria.cep_proprietario || ''}`
      };
    case 'financeira':
      return {
        name: vistoria.nome_financeira || 'N/A',
        address: `${vistoria.endereco_financeira || ''} ${vistoria.numero_endereco_financeira || ''} ${vistoria.complemento_financeira || ''}, ${vistoria.bairro_financeira || ''}, ${vistoria.cidade_financeira || ''} - CEP: ${vistoria.cep_financeira || ''}`
      };
    case 'possuidor':
      return {
        name: vistoria.nome_possuidor || 'N/A',
        address: `${vistoria.endereco_possuidor || ''}, ${vistoria.bairro_possuidor || ''}, ${vistoria.cidade_possuidor || ''} - CEP: ${vistoria.cep_possuidor || ''}`
      };
    default:
      return {
        name: 'N/A',
        address: 'N/A'
      };
  }
};

const generateNotificationBackPage = (
  recipient: { name: string; address: string },
  prefeituraLogo: string | null,
  smtranLogo: string | null
) => {
  return `
    <div class="page back-page">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-container">
              ${
                prefeituraLogo
                  ? `<img src="${prefeituraLogo}" alt="Prefeitura" class="logo-image" crossorigin="anonymous" />`
                  : '<div class="logo-text">PREFEITURA<br>GUANAMBI</div>'
              }
            </div>
            <div class="header-text">
              <div class="municipal-title">PREFEITURA MUNICIPAL DE GUANAMBI</div>
              <div class="subtitle">COMISSÃO DE LEILÃO</div>
            </div>
          </div>
          <div class="header-right">
            <div class="logo-container">
              ${
                smtranLogo
                  ? `<img src="${smtranLogo}" alt="SMTRAN" class="logo-image" crossorigin="anonymous" />`
                  : '<div class="logo-text">SMTRAN</div>'
              }
            </div>
            <div class="document-title">NOTIFICAÇÃO</div>
            <div style="margin-bottom:10px;"></div>
          </div>
        </div>
      </div>
      
      <!-- Remetente -->
      <div class="remetente" style="margin-top:40px; font-size:16px;">
        <strong>REMETENTE:</strong><br>
        Prefeitura Municipal de Guanambi - BA<br>
        Secretaria de Planejamento - COMISSÃO DE LEILÃO<br>
        Praça Henrique Pereira Donato, 90 - Centro<br>
        CEP: 46430-000 - Guanambi/BA
      </div>
      
      <!-- Destinatário -->
      <div class="destinatario" style="
        background: #f8fafc;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 20px;
        font-size: 16px;
        margin-bottom: 30px;
      ">
        <strong style="background: #3b82f6; color: white; padding: 10px 15px; margin: -20px -20px 15px -20px; font-size: 14px; border-radius: 6px 6px 0 0; display: block;">
          DESTINATÁRIO:
        </strong>
        ${recipient.name}<br>
        ${recipient.address}
      </div>
    </div>
  `;
};

export const generateNotificationPDF = async (vistoria: Vistoria, recipientType: NotificationRecipient) => {
  console.log('Starting notification PDF generation for vistoria:', vistoria.placa);
  
  // Buscar configurações do sistema
  const { prefeituraLogo, smtranLogo, presidenteName, notificationText } = await getSystemSettings();
  
  // Obter dados do destinatário
  const recipient = getRecipientData(vistoria, recipientType);
  
  // Criar nova janela para o PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar o PDF');
    return;
  }

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notificação de Veículo Apreendido - ${vistoria.placa}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .page {
          width: 210mm;
          margin: 0 auto;
          padding: 20mm;
          background: white;
          page-break-after: always;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        .header {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 8px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        
        .header-left {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .header-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        
        .logo-container {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
          font-weight: bold;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid #e5e7eb;
        }
        
        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }
        
        .logo-text {
          font-size: 9px;
          font-weight: bold;
          text-align: center;
          color: #1e40af;
          line-height: 1.2;
        }
        
        .municipal-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          color: white;
        }
        
        .subtitle {
          font-size: 12px;
          opacity: 0.95;
          color: white;
        }
        
        .document-title {
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
        
        .content {
          font-size: 12px;
          line-height: 1.8;
          text-align: justify;
          margin-bottom: 30px;
        }
        
        .date-location {
          text-align: right;
          margin-bottom: 30px;
          font-size: 12px;
        }
        
        .addressee {
          margin-bottom: 30px;
          font-size: 12px;
        }
        
        .addressee strong {
          display: block;
          margin-bottom: 5px;
        }
        
        .vehicle-info {
          background: #f8fafc;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }
        
        .vehicle-info h3 {
          background: #3b82f6;
          color: white;
          padding: 10px 15px;
          margin: -20px -20px 15px -20px;
          font-size: 14px;
          border-radius: 6px 6px 0 0;
        }
        
        .vehicle-details {
          font-size: 12px;
          line-height: 1.8;
        }
        
        .signature-area {
          margin-top: 60px;
          text-align: center;
        }
        
        .signature-line {
          border-top: 1px solid #333;
          width: 300px;
          margin: 40px auto 10px;
        }
        
        .president-name {
          font-weight: bold;
          font-size: 12px;
        }
        
        .president-title {
          font-size: 11px;
          color: #666;
        }
        
        /* Estilos específicos para a página de verso */
        .back-page {
          width: 210mm;
          height: 297mm;
          padding: 20mm;
          position: relative;
          font-size: 12px;
          background: white;
        }
        
        .back-page .header {
          margin-bottom: 40px;
        }
        
        .back-page .logo-container {
          width: 70px;
          height: 70px;
        }
        
        .back-page .municipal-title {
          font-size: 14px;
        }
        
        .remetente {
          position: absolute;
          top: 50mm;
          left: 20mm;
          font-size: 10px;
          line-height: 1.4;
        }
        
        .destinatario {
          position: absolute;
          top: 160mm;
          left: 50%;
          transform: translateX(-50%);
          width: 160mm;
          min-height: 40mm;
          font-size: 12px;
          border: 1px solid #000;
          padding: 5mm;
          line-height: 1.5;
        }
        
        @media print {
          .page {
            margin: 0;
            padding: 15mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .header {
            background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%) !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .vehicle-info h3 {
            background: #3b82f6 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .back-page {
            padding: 15mm;
          }
        }
      </style>
    </head>
    <body>
      <!-- Primeira página - Notificação -->
      <div class="page">
        <!-- Header -->
        <div class="header">
          <div class="header-content">
            <div class="header-left">
              <div class="logo-container">
                ${prefeituraLogo 
                  ? `<img src="${prefeituraLogo}" alt="Prefeitura" class="logo-image" crossorigin="anonymous" />` 
                  : '<div class="logo-text">PREFEITURA<br>GUANAMBI</div>'
                }
              </div>
              <div class="header-text">
                <div class="municipal-title">PREFEITURA MUNICIPAL DE GUANAMBI</div>
                <div class="subtitle">COMISSÃO DE LEILÃO</div>
              </div>
            </div>
            <div class="header-right">
              <div class="logo-container">
                ${smtranLogo 
                  ? `<img src="${smtranLogo}" alt="SMTRAN" class="logo-image" crossorigin="anonymous" />` 
                  : '<div class="logo-text">SMTRAN</div>'
                }
              </div>
              <div class="document-title">NOTIFICAÇÃO</div>
              <div style="margin-bottom:40px;"></div>
            </div>
          </div>
        </div>

        <!-- Date and Location -->
        <div class="date-location">
          Guanambi-Bahia, ${currentDate}
        </div>

        <!-- Addressee -->
        <div class="addressee">
          <strong>De:</strong> Prefeitura Municipal de Guanambi, Bahia<br>
          <strong>Para:</strong> ${recipient.name}<br>
          <div style="margin-top: 10px; font-size: 11px; color: #666;">
            ${recipient.address}
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          ${notificationText.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('\n          ')}
        </div>

        <!-- Vehicle Information -->
        <div class="vehicle-info">
          <h3>DADOS DO VEÍCULO</h3>
          <div class="vehicle-details">
            <strong>Placa/UF:</strong> ${vistoria.placa || 'N/A'}/${vistoria.uf || 'BA'}<br>
            <strong>Marca/Modelo:</strong> ${vistoria.marca || 'N/A'}/${vistoria.modelo || 'N/A'}<br>
            <strong>Chassi:</strong> ${vistoria.numero_chassi || 'N/A'}
          </div>
        </div>

        <!-- Final Note -->
        <div class="content">
          <p>Caso o veículo mencionado já não pertença a V. Sa. ou tenha sido previamente retirado, solicitamos que desconsidere esta notificação.</p>
        </div>

        <!-- Signature -->
        <div class="signature-area">
          <div class="signature-line"></div>
          <div class="president-name">${presidenteName}</div>
          <div class="president-title">Presidente da Comissão de Leilão</div>
        </div>
      </div>

      <!-- Segunda página - Verso para envelope -->
      ${generateNotificationBackPage(recipient, prefeituraLogo, smtranLogo)}
    </body>
    </html>
  `;

  console.log('Writing HTML to print window...');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Aguardar o carregamento e então imprimir
  printWindow.onload = () => {
    console.log('Print window loaded, starting print...');
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };
};