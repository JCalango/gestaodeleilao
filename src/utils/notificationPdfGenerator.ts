
import { Vistoria } from '@/types/vistoria';
import { NotificationRecipient } from '@/types/notification';
import { supabase } from '@/integrations/supabase/client';

const getSystemSettings = async () => {
  try {
    console.log('Fetching system settings from database...');
    const { data: settings, error } = await (supabase as any)
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
  return `Informamos a V. Sa. que o veículo descrito abaixo encontra-se apreendido e recolhido no depósito desta Superintendência de Trânsito de Guanambi (SMTRAN-GBI), nos termos do Art. 328 do Código de Trânsito Brasileiro (CTB), alterado pela Lei nº. 13.160/2015, e da Resolução nº. 623/2016 do Conselho Nacional de Trânsito (CONTRAN).

Para evitar a execução do mesmo, solicitamos seu comparecimento a fim de restituir-lhe o referido veículo, após quitação dos débitos existentes e outras eventuais despesas, e promova sua retirada do depósito, sob pena de o não cumprimento desta Notificação no prazo de 30 (trinta) dias, ser levado à hasta pública.

Para que seja feita a retirada do veículo, V. Sa. deverá comparecer, de segunda a sexta, no horário de atendimento ao público, no Setor de Liberação de Veículo, situado na av. Joaquim Chaves, nº 401, B. Santo Antônio, Guanambi – Bahia, ou entre em contato pelo número 077 988029862.`;
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
        
        .page-2 {
          width: 210mm;
          height: 297mm;
          padding: 0;
          position: relative;
          overflow: hidden;
          page-break-after: auto;
        }
        
        .sender-area {
          width: 100%;
          height: 60mm;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 10mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .sender-logo-box {
          background: white;
          padding: 5px;
          border-radius: 8px;
          width: 40mm;
          height: 35mm;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .sender-logo-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .sender-logo-text {
          font-size: 10px;
          font-weight: bold;
          text-align: center;
          color: #667eea;
          line-height: 1.2;
        }
        
        .sender-info {
          flex: 1;
          text-align: center;
          padding: 0 10px;
        }
        
        .sender-title {
          font-size: 18px;
          margin: 0;
          font-weight: bold;
          letter-spacing: 1px;
          color: white;
        }
        
        .sender-subtitle {
          font-size: 12px;
          margin: 5px 0;
          opacity: 0.9;
          color: white;
        }
        
        .sender-commission {
          font-size: 12px;
          margin: 0;
          font-weight: bold;
          color: white;
        }
        
        .sender-address {
          font-size: 10px;
          margin-top: 10px;
          opacity: 0.8;
          line-height: 1.4;
          color: white;
        }
        
        .fold-mark {
          position: absolute;
          top: calc(60mm + 148.5mm / 2 + 30mm);
          width: 10mm;
          border-top: 1px dashed #ccc;
        }
        .fold-mark-left { left: 0; }
        .fold-mark-right { right: 0; }
        
        .recipient-area {
          position: absolute;
          bottom: 20mm;
          left: 50%;
          transform: translateX(-50%) rotate(180deg);
          width: 120mm;
          background: white;
          border: 2px solid #667eea;
          border-left: 8px solid #667eea;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .recipient-label {
          color: #667eea;
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        
        .recipient-name {
          color: #2d3748;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .recipient-address {
          color: #4a5568;
          font-size: 13px;
          line-height: 1.6;
          font-family: 'Courier New', monospace;
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
        
        @media print {
          .page {
            margin: 0;
            padding: 15mm;
          }
          
          .page-2 {
            padding: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .sender-area {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
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
        }
      </style>
    </head>
    <body>
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
          <p>Caso o veículo citado não seja mais de sua propriedade ou já tenha sido feita sua retirada, favor desconsiderar esta Notificação.</p>
        </div>

        <!-- Signature -->
        <div class="signature-area">
          <div class="signature-line"></div>
          <div class="president-name">${presidenteName}</div>
          <div class="president-title">Presidente da Comissão de Leilão</div>
        </div>
      </div>

      <!-- SEGUNDA PÁGINA - VERSO (Padrão Correios) -->
      <div class="page page-2">
        <!-- REMETENTE (TOPO) -->
        <div class="sender-area">
          <div class="sender-logo-box">
            ${prefeituraLogo 
              ? `<img src="${prefeituraLogo}" alt="Prefeitura" class="sender-logo-img" crossorigin="anonymous" />` 
              : '<div class="sender-logo-text">PREFEITURA<br>GUANAMBI</div>'
            }
          </div>
          <div class="sender-info">
            <h1 class="sender-title">PREFEITURA MUNICIPAL DE GUANAMBI</h1>
            <p class="sender-subtitle">SECRETARIA DE PLANEJAMENTO</p>
            <p class="sender-commission">COMISSÃO DE LEILÃO</p>
            <div class="sender-address">
              Praça Henrique Pereira Donato, 90 - Centro<br>
              CEP: 46.430-000 | Guanambi - Bahia
            </div>
          </div>
          <div class="sender-logo-box">
            ${smtranLogo 
              ? `<img src="${smtranLogo}" alt="SMTRAN" class="sender-logo-img" crossorigin="anonymous" />` 
              : '<div class="sender-logo-text">SMTRAN</div>'
            }
          </div>
        </div>

        <!-- MARCAS DE DOBRA -->
        <div class="fold-mark fold-mark-left"></div>
        <div class="fold-mark fold-mark-right"></div>

        <!-- DESTINATÁRIO (BASE - INVERTIDO 180°) -->
        <div class="recipient-area">
          <div class="recipient-label">Destinatário</div>
          <div class="recipient-name">${recipient.name}</div>
          <div class="recipient-address">
            ${recipient.address}
          </div>
        </div>
      </div>
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
