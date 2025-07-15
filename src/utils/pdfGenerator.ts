
import { Vistoria } from '@/types/vistoria';
import { supabase } from '@/integrations/supabase/client';

const getSystemLogos = async () => {
  try {
    console.log('Fetching system logos from database...');
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')
      .in('setting_key', ['prefeitura_logo', 'smtran_logo']);

    if (error) {
      console.error('Error fetching logos:', error);
      return { prefeituraLogo: null, smtranLogo: null };
    }

    console.log('Settings data:', settings);

    const prefeituraLogo = settings?.find(s => s.setting_key === 'prefeitura_logo')?.setting_value || null;
    const smtranLogo = settings?.find(s => s.setting_key === 'smtran_logo')?.setting_value || null;

    console.log('Logo URLs - Prefeitura:', prefeituraLogo, 'SMTRAN:', smtranLogo);

    return { prefeituraLogo, smtranLogo };
  } catch (error) {
    console.error('Error fetching system logos:', error);
    return { prefeituraLogo: null, smtranLogo: null };
  }
};

const getVistoriaPhotos = async (vistoriaId: string) => {
  try {
    console.log('Fetching photos for vistoria:', vistoriaId);
    
    // Buscar URLs das fotos na tabela de vistorias
    const { data: vistoria, error } = await supabase
      .from('vistorias')
      .select('fotos_frente, fotos_lateral_esquerda, fotos_lateral_direita, fotos_chassi, fotos_traseira, fotos_motor')
      .eq('id', vistoriaId)
      .single();

    if (error) {
      console.error('Error fetching vistoria photos:', error);
      return {
        fotos_frente: [],
        fotos_lateral_esquerda: [],
        fotos_lateral_direita: [],
        fotos_chassi: [],
        fotos_traseira: [],
        fotos_motor: []
      };
    }

    console.log('Vistoria photos found:', vistoria);

    return {
      fotos_frente: vistoria?.fotos_frente || [],
      fotos_lateral_esquerda: vistoria?.fotos_lateral_esquerda || [],
      fotos_lateral_direita: vistoria?.fotos_lateral_direita || [],
      fotos_chassi: vistoria?.fotos_chassi || [],
      fotos_traseira: vistoria?.fotos_traseira || [],
      fotos_motor: vistoria?.fotos_motor || []
    };
  } catch (error) {
    console.error('Error fetching vistoria photos:', error);
    return {
      fotos_frente: [],
      fotos_lateral_esquerda: [],
      fotos_lateral_direita: [],
      fotos_chassi: [],
      fotos_traseira: [],
      fotos_motor: []
    };
  }
};

const preloadImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Image loaded successfully:', url);
      resolve(true);
    };
    img.onerror = (error) => {
      console.error('Image failed to load:', url, error);
      resolve(false);
    };
    img.src = url;
  });
};

const generatePhotoGrid = (photos: any) => {
  const photoCategories = [
    { key: 'fotos_frente', title: 'Frente' },
    { key: 'fotos_lateral_esquerda', title: 'Lateral Esquerda' },
    { key: 'fotos_lateral_direita', title: 'Lateral Direita' },
    { key: 'fotos_traseira', title: 'Traseira' },
    { key: 'fotos_motor', title: 'Motor' },
    { key: 'fotos_chassi', title: 'Chassi' }
  ];

  // Criar array com todas as fotos disponíveis
  const allPhotos = [];
  photoCategories.forEach(category => {
    const categoryPhotos = photos[category.key] || [];
    categoryPhotos.forEach(photo => {
      allPhotos.push({
        url: photo,
        title: category.title
      });
    });
  });

  if (allPhotos.length === 0) {
    return `
      <div class="photo-section">
        <div class="photo-section-title">Documentação Fotográfica</div>
        <div class="photo-section-content">
          <div class="no-photo-message">
            <p>Nenhuma foto disponível para esta vistoria</p>
          </div>
        </div>
      </div>
    `;
  }

  // Organizar em grid de 2 colunas
  const photosPerRow = 2;
  let gridHtml = '';
  
  for (let i = 0; i < allPhotos.length; i += photosPerRow) {
    const rowPhotos = allPhotos.slice(i, i + photosPerRow);
    gridHtml += `
      <div class="photo-row">
        ${rowPhotos.map(photo => `
          <div class="photo-item-large">
            <div class="photo-label">${photo.title}</div>
            <img src="${photo.url}" alt="${photo.title}" class="photo-image-large" crossorigin="anonymous" />
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="photo-section">
      <div class="photo-section-title">Documentação Fotográfica</div>
      <div class="photo-section-content">
        <div class="photo-grid-container">
          ${gridHtml}
        </div>
      </div>
    </div>
  `;
};

export const generateInspectionPDF = async (vistoria: Vistoria) => {
  console.log('Starting PDF generation for vistoria:', vistoria.placa);
  
  // Buscar logos do sistema
  const { prefeituraLogo, smtranLogo } = await getSystemLogos();
  
  // Buscar fotos da vistoria
  const photos = await getVistoriaPhotos(vistoria.id);
  
  // Pre-carregar as imagens se existirem
  const logoPromises = [];
  if (prefeituraLogo) {
    console.log('Preloading prefeitura logo:', prefeituraLogo);
    logoPromises.push(preloadImage(prefeituraLogo));
  }
  if (smtranLogo) {
    console.log('Preloading SMTRAN logo:', smtranLogo);
    logoPromises.push(preloadImage(smtranLogo));
  }
  
  // Pre-carregar fotos da vistoria
  const photoPromises = [];
  Object.values(photos).forEach(photoArray => {
    photoArray.forEach(photoUrl => {
      if (photoUrl) {
        photoPromises.push(preloadImage(photoUrl));
      }
    });
  });
  
  // Aguardar o carregamento das imagens
  if (logoPromises.length > 0) {
    console.log('Waiting for logos to load...');
    await Promise.all(logoPromises);
    console.log('All logos loaded');
  }
  
  if (photoPromises.length > 0) {
    console.log('Waiting for photos to load...');
    await Promise.all(photoPromises);
    console.log('All photos loaded');
  }
  
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

  const dataInspecao = vistoria.data_inspecao 
    ? new Date(vistoria.data_inspecao).toLocaleDateString('pt-BR') 
    : 'N/A';

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
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
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
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          break-inside: avoid;
          page-break-inside: avoid;
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
          width: 100px;
          height: 100px;
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
          font-size: 11px;
          font-weight: bold;
          text-align: center;
          color: #1e40af;
          line-height: 1.2;
        }
        
        .header-text {
          flex: 1;
        }
        
        .municipal-title {
          font-size: 18px;
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
          font-size: 16px;
          font-weight: bold;
          color: white;
        }
        
        .date-info {
          font-size: 11px;
          margin-top: 5px;
          color: white;
        }
        
        .section {
          margin-bottom: 25px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        .section-title {
          background: #3b82f6;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 0;
          border-radius: 8px 8px 0 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
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
        
        .info-grid.four-cols {
          grid-template-columns: 1fr 1fr 1fr 1fr;
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
          background: #f8fafc;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
          color: #334155;
        }
        
        .motor-chassi-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
          break-inside: avoid;
          page-break-inside: avoid;
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
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .subsection-title.chassi {
          background: #0891b2;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .subsection-content {
          padding: 15px;
          background: white;
        }
        
        .condition-highlight {
          border: 2px solid #f59e0b;
          border-radius: 4px;
          padding: 5px;
          background: #fef3c7;
          margin-top: 5px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .restrictions-section {
          background: #fed7aa;
          border: 2px solid #ea580c;
          border-radius: 8px;
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .restrictions-title {
          background: #ea580c;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .restrictions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          padding: 15px;
        }
        
        .observations-section {
          background: #374151;
          color: white;
          border-radius: 8px;
          margin-top: 20px;
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .observations-title {
          background: #374151;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          border-radius: 8px 8px 0 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
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
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .responsibility-title {
          background: #6366f1;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          border-radius: 8px 8px 0 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
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
        
        .photo-section {
          margin-bottom: 20px;
          border: 2px solid #8b5cf6;
          border-radius: 8px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .photo-section-title {
          background: #8b5cf6;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .photo-section-content {
          padding: 15px;
          background: white;
        }
        
        .photo-grid-container {
          width: 100%;
        }
        
        .photo-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          align-items: flex-start;
        }
        
        .photo-item-large {
          flex: 1;
          text-align: center;
          min-width: 0;
        }
        
        .photo-label {
          font-weight: bold;
          color: #4c51bf;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .photo-image-large {
          width: 100%;
          max-width: 350px;
          height: auto;
          min-height: 250px;
          max-height: 300px;
          object-fit: contain;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background: #f8fafc;
        }
        
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        
        .photo-item {
          text-align: center;
        }
        
        .photo-image {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }
        
        .no-photo-message {
          text-align: center;
          padding: 40px 20px;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
          font-style: italic;
          font-size: 16px;
        }
        
        .people-info-section {
          background: #f0f9ff;
          border: 2px solid #0284c7;
          border-radius: 8px;
          margin-top: 20px;
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .people-info-title {
          background: #0284c7;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .people-info-content {
          padding: 15px;
          background: white;
          color: #333;
        }
        
        .person-section {
          margin-bottom: 20px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 4px solid #0284c7;
        }
        
        .person-title {
          font-weight: bold;
          color: #0284c7;
          margin-bottom: 8px;
          font-size: 13px;
          text-transform: uppercase;
        }
        
        .person-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        
        .debts-section {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 8px;
          margin-top: 20px;
          break-inside: avoid;
          page-break-inside: avoid;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .debts-title {
          background: #f59e0b;
          color: white;
          padding: 10px 15px;
          font-weight: bold;
          margin: 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .debts-content {
          padding: 15px;
          background: white;
          color: #333;
        }
        
        @media print {
          .page {
            margin: 0;
            padding: 10mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .header {
            background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%) !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: #3b82f6 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .subsection-title {
            background: #10b981 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .subsection-title.chassi {
            background: #0891b2 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .restrictions-title {
            background: #ea580c !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .observations-title {
            background: #374151 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .responsibility-title {
            background: #6366f1 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .photo-section-title {
            background: #8b5cf6 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .people-info-title {
            background: #0284c7 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .debts-title {
            background: #f59e0b !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .photo-image-large {
            max-height: 250px;
          }
          
          .photo-row {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .motor-chassi-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .restrictions-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .people-info-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .debts-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .observations-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          .responsibility-section {
            break-inside: avoid;
            page-break-inside: avoid;
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
                <div class="subtitle">SMTRAN - Superintendência Municipal de Trânsito</div>
              </div>
            </div>
            <div class="header-right">
              <div class="logo-container">
                ${smtranLogo 
                  ? `<img src="${smtranLogo}" alt="SMTRAN" class="logo-image" crossorigin="anonymous" />` 
                  : '<div class="logo-text">SMTRAN</div>'
                }
              </div>
              <div class="document-title">LAUDO DE VISTORIA VEICULAR</div>
              <div class="date-info">Data: ${currentDate}</div>
            </div>
          </div>
        </div>

        <!-- Controle -->
        <div class="section">
          <div class="section-title">CONTROLE</div>
          <div class="section-content">
            <div class="info-item">
              <div class="info-label">NÚMERO DO LOTE</div>
              <div class="info-value">${vistoria.numero_controle || 'N/A'}</div>
            </div>
            ${vistoria.data_inspecao ? `
            <div class="info-item">
              <div class="info-label">DATA DA INSPEÇÃO</div>
              <div class="info-value">${dataInspecao}</div>
            </div>
            ` : ''}
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
                <div class="info-label">CATEGORIA</div>
                <div class="info-value">${vistoria.categoria || 'N/A'}</div>
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
                <div class="info-label">PLACA PADRÃO MERCOSUL</div>
                <div class="info-value">${vistoria.placa && vistoria.placa.length === 7 ? 'SIM' : 'NÃO'}</div>
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
                <div class="condition-highlight">${vistoria.condicao_motor || 'Dentro dos padrões originais'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">MOTOR ALTERADO?</div>
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
                <div class="info-label">CHASSI REMARCADO?</div>
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
              <div class="info-label">ALIENAÇÃO FIDUCIÁRIA?</div>
              <div class="info-value">${vistoria.alienacao_fiduciaria ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">POSSUI COMUNICAÇÃO DE VENDA?</div>
              <div class="info-value">${vistoria.possui_comunicacao_venda ? 'SIM' : 'NÃO'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">VEÍCULO POSSUI HISTÓRICO DE LEILÃO?</div>
              <div class="info-value">NÃO</div>
            </div>
          </div>
        </div>

        <!-- Informações das Pessoas -->
        <div class="people-info-section">
          <div class="people-info-title">INFORMAÇÕES DAS PESSOAS</div>
          <div class="people-info-content">
            <!-- Proprietário -->
            <div class="person-section">
              <div class="person-title">PROPRIETÁRIO</div>
              <div class="person-info">
                <div class="info-item">
                  <div class="info-label">NOME</div>
                  <div class="info-value">${vistoria.nome_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CPF/CNPJ</div>
                  <div class="info-value">${vistoria.cpf_cnpj_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ENDEREÇO</div>
                  <div class="info-value">${vistoria.endereco_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">NÚMERO</div>
                  <div class="info-value">${vistoria.numero_casa_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">COMPLEMENTO</div>
                  <div class="info-value">${vistoria.complemento_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CEP</div>
                  <div class="info-value">${vistoria.cep_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CIDADE</div>
                  <div class="info-value">${vistoria.cidade_proprietario || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">BAIRRO</div>
                  <div class="info-value">${vistoria.bairro_proprietario || 'N/A'}</div>
                </div>
                ${vistoria.informacoes_complementares_proprietario ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                  <div class="info-label">INFORMAÇÕES COMPLEMENTARES</div>
                  <div class="info-value">${vistoria.informacoes_complementares_proprietario}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Possuidor -->
            ${vistoria.nome_possuidor || vistoria.cpf_cnpj_possuidor ? `
            <div class="person-section">
              <div class="person-title">POSSUIDOR</div>
              <div class="person-info">
                <div class="info-item">
                  <div class="info-label">NOME</div>
                  <div class="info-value">${vistoria.nome_possuidor || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CPF/CNPJ</div>
                  <div class="info-value">${vistoria.cpf_cnpj_possuidor || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ENDEREÇO</div>
                  <div class="info-value">${vistoria.endereco_possuidor || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CEP</div>
                  <div class="info-value">${vistoria.cep_possuidor || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CIDADE</div>
                  <div class="info-value">${vistoria.cidade_possuidor || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">BAIRRO</div>
                  <div class="info-value">${vistoria.bairro_possuidor || 'N/A'}</div>
                </div>
                ${vistoria.informacoes_complementares_possuidor ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                  <div class="info-label">INFORMAÇÕES COMPLEMENTARES</div>
                  <div class="info-value">${vistoria.informacoes_complementares_possuidor}</div>
                </div>
                ` : ''}
              </div>
            </div>
            ` : ''}

            <!-- Financeira -->
            ${vistoria.nome_financeira || vistoria.cnpj_financeira ? `
            <div class="person-section">
              <div class="person-title">FINANCEIRA</div>
              <div class="person-info">
                <div class="info-item">
                  <div class="info-label">NOME</div>
                  <div class="info-value">${vistoria.nome_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CNPJ</div>
                  <div class="info-value">${vistoria.cnpj_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">ENDEREÇO</div>
                  <div class="info-value">${vistoria.endereco_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">NÚMERO</div>
                  <div class="info-value">${vistoria.numero_endereco_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">COMPLEMENTO</div>
                  <div class="info-value">${vistoria.complemento_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CEP</div>
                  <div class="info-value">${vistoria.cep_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">CIDADE</div>
                  <div class="info-value">${vistoria.cidade_financeira || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">BAIRRO</div>
                  <div class="info-value">${vistoria.bairro_financeira || 'N/A'}</div>
                </div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Informações de Débitos -->
        <div class="debts-section">
          <div class="debts-title">INFORMAÇÕES DE DÉBITOS</div>
          <div class="debts-content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">IPVA</div>
                <div class="info-value">${vistoria.ipva || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">LICENCIAMENTO</div>
                <div class="info-value">${vistoria.licenciamento || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">INFRAÇÕES DE TRÂNSITO</div>
                <div class="info-value">${vistoria.infracoes_transito || 'N/A'}</div>
              </div>
            </div>
            
            <div class="info-grid two-cols">
              <div class="info-item">
                <div class="info-label">DATA ENTRADA PÁTIO</div>
                <div class="info-value">
                  ${vistoria.data_entrada_patio 
                    ? new Date(vistoria.data_entrada_patio).toLocaleDateString('pt-BR')
                    : 'N/A'
                  }
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">DÉBITO PÁTIO</div>
                <div class="info-value">
                  ${vistoria.debito_patio 
                    ? `R$ ${Number(vistoria.debito_patio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
            
            ${vistoria.dados_remocao ? `
            <div class="info-item">
              <div class="info-label">DADOS DE REMOÇÃO</div>
              <div class="info-value">${vistoria.dados_remocao}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Seção de Fotos com Grid Layout -->
        ${generatePhotoGrid(photos)}

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

  console.log('Writing HTML to print window...');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Aguardar o carregamento e então imprimir
  printWindow.onload = () => {
    console.log('Print window loaded, starting print...');
    setTimeout(() => {
      printWindow.print();
    }, 1500); // Aumentei o delay para garantir que todas as imagens carreguem
  };
};
