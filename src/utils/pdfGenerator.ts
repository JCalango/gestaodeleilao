
import { Vistoria } from '@/types/vistoria';
import { supabase } from '@/integrations/supabase/client';

const getSystemLogos = async () => {
  try {
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .in('setting_key', ['prefeitura_logo', 'smtran_logo']);

    if (error) {
      console.error('Error fetching logos:', error);
      return { prefeituraLogo: null, smtranLogo: null };
    }

    const prefeituraLogo = settings?.find(s => s.setting_key === 'prefeitura_logo')?.setting_value || null;
    const smtranLogo = settings?.find(s => s.setting_key === 'smtran_logo')?.setting_value || null;

    return { prefeituraLogo, smtranLogo };
  } catch (error) {
    console.error('Error fetching system logos:', error);
    return { prefeituraLogo: null, smtranLogo: null };
  }
};

export const generateInspectionPDF = async (vistoria: Vistoria) => {
  // Buscar logos do sistema
  const { prefeituraLogo, smtranLogo } = await getSystemLogos();
  
  // Criar nova janela para o PDF
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar o PDF');
    return;
  }

  const currentDate = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laudo de Vistoria Veicular - ${vistoria.placa}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: white;
        }
        
        .page {
          width: 210mm;
          margin: 0 auto;
          padding: 15mm;
          background: white;
        }
        
        .header {
          background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 8px;
          position: relative;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-left {
          flex: 1;
        }
        
        .header-right {
          text-align: right;
        }
        
        .logo-container {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e40af;
          font-weight: bold;
          margin-bottom: 10px;
          overflow: hidden;
        }
        
        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        
        .logo-text {
          font-size: 10px;
          font-weight: bold;
          text-align: center;
        }
        
        .municipal-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .subtitle {
          font-size: 11px;
          opacity: 0.9;
        }
        
        .document-title {
          font-size: 16px;
          font-weight: bold;
        }
        
        .date-info {
          font-size: 11px;
          margin-top: 5px;
        }
        
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          background: #3b82f6;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 0;
          border-radius: 8px 8px 0 0;
        }
        
        .section-content {
          border: 2px solid #3b82f6;
          border-top: none;
          padding: 15px;
          border-radius: 0 0 8px 8px;
          background: white;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .info-grid.two-cols {
          grid-template-columns: 1fr 1fr;
        }
        
        .info-item {
          margin-bottom: 10px;
        }
        
        .info-label {
          font-weight: bold;
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        
        .info-value {
          background: #f3f4f6;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          font-size: 12px;
        }
        
        .motor-chassi-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .subsection {
          border: 2px solid #10b981;
          border-radius: 8px;
        }
        
        .subsection.chassi {
          border-color: #0891b2;
        }
        
        .subsection-title {
          background: #10b981;
          color: white;
          padding: 8px 15px;
          font-weight: bold;
          margin: 0;
        }
        
        .subsection-title.chassi {
          background: #0891b2;
        }
        
        .subsection-content {
          padding: 15px;
        }
        
        .condition-highlight {
          border: 2px solid #f59e0b;
          border-radius: 4px;
          padding: 5px;
          background: #fef3c7;
          margin-top: 5px;
        }
        
        .restrictions-section {
          background: #fed7aa;
          border: 2px solid #ea580c;
          border-radius: 8px;
        }
        
        .restrictions-title {
          background: #ea580c;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
        }
        
        .restrictions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          padding: 15px;
        }
        
        .observations-section {
          background: #374151;
          color: white;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .observations-title {
          background: #374151;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          border-radius: 8px 8px 0 0;
        }
        
        .observations-content {
          padding: 15px;
          background: white;
          color: #333;
          border-radius: 0 0 8px 8px;
        }
        
        .responsibility-section {
          background: #6366f1;
          color: white;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .responsibility-title {
          background: #6366f1;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          border-radius: 8px 8px 0 0;
        }
        
        .responsibility-content {
          padding: 15px;
          background: white;
          color: #333;
          border-radius: 0 0 8px 8px;
        }
        
        .inspector-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 15px;
        }
        
        .signature-area {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        @media print {
          .page {
            margin: 0;
            padding: 10mm;
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
                  ? `<img src="${prefeituraLogo}" alt="Prefeitura" class="logo-image" />` 
                  : '<div class="logo-text">GUANAMBI</div>'
                }
              </div>
              <div class="municipal-title">PREFEITURA MUNICIPAL DE GUANAMBI</div>
              <div class="subtitle">SMTRAN - Superintendência Municipal de Trânsito</div>
            </div>
            <div class="header-right">
              <div class="logo-container" style="margin-left: auto;">
                ${smtranLogo 
                  ? `<img src="${smtranLogo}" alt="SMTRAN" class="logo-image" />` 
                  : '<div class="logo-text">SMTRAN</div>'
                }
              </div>
              <div class="document-title">LAUDO DE VISTORIA VEICULAR</div>
              <div class="date-info">Data: ${currentDate}</div>
            </div>
          </div>
        </div>

        <!-- Informações do Veículo -->
        <div class="section">
          <div class="section-title">INFORMAÇÕES DO VEÍCULO</div>
          <div class="section-content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">PLACA</div>
                <div class="info-value">${vistoria.placa || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">RENAVAM</div>
                <div class="info-value">${vistoria.renavam || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">TIPO</div>
                <div class="info-value">Veículo</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">MARCA</div>
                <div class="info-value">${vistoria.marca || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">MODELO</div>
                <div class="info-value">${vistoria.modelo || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">COR</div>
                <div class="info-value">${vistoria.cor || 'N/A'}</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">ANO FABRICAÇÃO</div>
                <div class="info-value">${vistoria.ano_fabricacao || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ANO MODELO</div>
                <div class="info-value">${vistoria.ano_modelo || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">COMBUSTÍVEL</div>
                <div class="info-value">${vistoria.tipo_combustivel || 'N/A'}</div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">MUNICÍPIO</div>
                <div class="info-value">${vistoria.municipio || 'GUANAMBI'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">UF</div>
                <div class="info-value">${vistoria.uf || 'BA'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ESPÉCIE</div>
                <div class="info-value">Passageiro</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Motor e Chassi -->
        <div class="motor-chassi-section">
          <div class="subsection">
            <div class="subsection-title">MOTOR</div>
            <div class="subsection-content">
              <div class="info-item">
                <div class="info-label">NÚMERO</div>
                <div class="info-value">${vistoria.numero_motor || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">CONDIÇÃO</div>
                <div class="condition-highlight">${vistoria.condicao_motor || 'Não informado'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">MOTOR NÃO PERTENCENTE AO VEÍCULO?</div>
                <div class="info-value">NÃO</div>
              </div>
            </div>
          </div>
          
          <div class="subsection chassi">
            <div class="subsection-title chassi">CHASSI</div>
            <div class="subsection-content">
              <div class="info-item">
                <div class="info-label">NÚMERO</div>
                <div class="info-value">${vistoria.numero_chassi || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">CONDIÇÃO</div>
                <div class="info-value">${vistoria.condicao_chassi || 'Dentro dos padrões originais'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">DANO/REPARO?</div>
                <div class="info-value">NÃO</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Condições e Restrições -->
        <div class="restrictions-section">
          <div class="restrictions-title">CONDIÇÕES E RESTRIÇÕES</div>
          <div class="restrictions-grid">
            <div class="info-item">
              <div class="info-label">DANO/REPARO EIXO TRASEIRO?</div>
              <div class="info-value">NÃO</div>
            </div>
            <div class="info-item">
              <div class="info-label">PLACA NOVO PADRÃO?</div>
              <div class="info-value">${vistoria.placa && vistoria.placa.length === 7 ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ROUBO/FURTO?</div>
              <div class="info-value">${vistoria.furto_roubo ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">RESTRIÇÃO JUDICIAL?</div>
              <div class="info-value">${vistoria.restricao_judicial ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">RESTRIÇÃO ADMINISTRATIVA?</div>
              <div class="info-value">${vistoria.restricao_administrativa ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">VEÍCULO POSSUI HISTÓRICO DE LEILÃO?</div>
              <div class="info-value">NÃO</div>
            </div>
          </div>
        </div>

        ${vistoria.observacoes ? `
        <!-- Observações -->
        <div class="observations-section">
          <div class="observations-title">OBSERVAÇÕES</div>
          <div class="observations-content">
            <p>${vistoria.observacoes}</p>
          </div>
        </div>
        ` : ''}

        <!-- Responsabilidade -->
        <div class="responsibility-section">
          <div class="responsibility-title">RESPONSABILIDADE</div>
          <div class="responsibility-content">
            <p><strong>Vistoriadores designados pela Portaria nº 01/2025 da Secretaria Municipal de Planejamento de Guanambi:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Rogério da Cruz Mota</li>
              <li>Miqueias Gomes Costa</li>
              <li>Umberto Kleber Fernandes Silva</li>
            </ul>
            
            <div class="inspector-info">
              <div class="info-item">
                <div class="info-label">VISTORIADOR</div>
                <div class="info-value">MIQUEIAS GOMES COSTA</div>
              </div>
              <div class="info-item">
                <div class="info-label">DATA/HORA</div>
                <div class="info-value">${currentDate}</div>
              </div>
            </div>
            
            <div class="signature-area">
              <p>Assinatura do Vistoriador</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Aguardar o carregamento e então imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};
