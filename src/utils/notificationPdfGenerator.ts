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
          height: 297mm;
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
        
        /* Segunda página - Layout para dobra */
        .envelope-page {
          position: relative;
          height: 297mm;
          width: 210mm;
          margin: 0 auto;
          padding: 0;
          background: white;
        }
        
        .fold-guide {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          border-top: 1px dashed #ccc;
          top: 50%;
          z-index: 1;
        }
        
        .fold-guide::before {
          content: "← DOBRAR AQUI →";
          position: absolute;
          left: 50%;
          top: -10px;
          transform: translateX(-50%);
          background: white;
          padding: 0 10px;
          font-size: 8px;
          color: #999;
        }
        
        .sender-section {
          position: absolute;
          top: 10mm;
          left: 10mm;
          right: 10mm;
          height: calc(50% - 15mm);
          transform: rotate(180deg);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 5mm;
        }
        
        .recipient-section {
          position: absolute;
          bottom: 10mm;
          left: 10mm;
          right: 10mm;
          height: calc(50% - 15mm);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 5mm;
        }
        
        .address-box {
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 20px;
          background: white;
          width: 100%;
          max-width: 500px;
          min-height: 140px;
          position: relative;
        }
        
        .address-header {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 8px 15px;
          margin: -20px -20px 15px -20px;
          border-radius: 6px 6px 0 0;
          font-weight: bold;
          font-size: 12px;
          text-align: center;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .address-content {
          font-size: 11px;
          line-height: 1.6;
          color: #333;
        }
        
        .address-lines {
          border-bottom: 1px solid #ddd;
          margin-bottom: 8px;
          padding-bottom: 4px;
          min-height: 20px;
        }
        
        .institutional-info {
          font-size: 10px;
          color: #666;
          text-align: center;
          margin-top: 10px;
          font-weight: 500;
        }
        
        @media print {
          .page {
            margin: 0;
            padding: 15mm;
          }
          
          .envelope-page {
            margin: 0;
            padding: 0;
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
          
          .address-header {
            background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%) !important;
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

      <!-- Segunda Página - Layout para Envelope -->
      <div class="envelope-page">
        <!-- Linha guia para dobra -->
        <div class="fold-guide"></div>
        
        <!-- Seção do Remetente (parte superior, de cabeça para baixo) -->
        <div class="sender-section">
          <div class="address-box">
            <div class="address-header">REMETENTE</div>
            <div class="address-content">
              <div class="address-lines">
                <strong>PREFEITURA MUNICIPAL DE GUANAMBI</strong><br>
                COMISSÃO DE LEILÃO
              </div>
              <div class="address-lines">
                Praça Henrique Pereira Donato, 90<br>
                Centro Administrativo
              </div>
              <div class="address-lines">
                Guanambi - Bahia<br>
                CEP 46.430-000
              </div>
              <div class="institutional-info">
                ${smtranLogo 
                  ? `<img src="${smtranLogo}" alt="SMTRAN" style="height: 20px; margin-right: 10px;" crossorigin="anonymous" />` 
                  : 'SMTRAN'
                } | PREFEITURA MUNICIPAL DE GUANAMBI
              </div>
            </div>
          </div>
        </div>
        
        <!-- Seção do Destinatário (parte inferior) -->
        <div class="recipient-section">
          <div class="address-box">
            <div class="address-header">DESTINATÁRIO</div>
            <div class="address-content">
              <div class="address-lines">
                <strong>${recipient.name}</strong>
              </div>
              <div class="address-lines">
                ${recipient.address.split(',')[0] || '_'.repeat(40)}
              </div>
              <div class="address-lines">
                ${recipient.address.split(',').slice(1).join(',').trim() || '_'.repeat(40)}
              </div>
              <div class="address-lines">
                ${recipient.address.includes('CEP') ? recipient.address.split('CEP')[1]?.trim() || '_'.repeat(15) : '_'.repeat(15)}
              </div>
            </div>
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
