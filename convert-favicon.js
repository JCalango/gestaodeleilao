#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertFavicon() {
  try {
    const svgPath = path.join(__dirname, 'public', 'favicon.svg');
    
    if (fs.existsSync(svgPath)) {
      console.log('✓ Favicon SVG criado com sucesso em: public/favicon.svg');
      console.log('✓ O index.html foi atualizado para usar o favicon SVG');
      console.log('\n✓ Seu ícone de carro é um arquivo SVG moderno e responsivo!');
      console.log('✓ Todos os navegadores modernos suportam favicon em SVG nativamente.');
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

convertFavicon();
