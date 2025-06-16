
export interface Vistoria {
  id: string;
  numero_controle: string;
  data_inspecao?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
  // Informações do veículo
  placa?: string;
  marca?: string;
  modelo?: string;
  renavam?: string;
  cor?: string;
  ano_fabricacao?: number;
  ano_modelo?: number;
  municipio?: string;
  uf?: string;
  tipo_combustivel?: string;
  categoria?: string;
  numero_motor?: string;
  condicao_motor?: string;
  numero_chassi?: string;
  condicao_chassi?: string;
  furto_roubo?: boolean;
  restricao_judicial?: boolean;
  restricao_administrativa?: boolean;
  alienacao_fiduciaria?: boolean;
  observacoes?: string;
  
  // Informações do proprietário
  nome_proprietario?: string;
  cpf_cnpj_proprietario?: string;
  endereco_proprietario?: string;
  numero_casa_proprietario?: string;
  complemento_proprietario?: string;
  informacoes_complementares_proprietario?: string;
  cep_proprietario?: string;
  cidade_proprietario?: string;
  bairro_proprietario?: string;
  
  // Informações de débitos do veículo
  ipva?: string;
  licenciamento?: string;
  infracoes_transito?: string;
  data_entrada_patio?: string;
  debito_patio?: number;
  dados_remocao?: string;
  
  // Comunicação de venda
  possui_comunicacao_venda?: boolean;
  nome_possuidor?: string;
  cpf_cnpj_possuidor?: string;
  endereco_possuidor?: string;
  informacoes_complementares_possuidor?: string;
  cep_possuidor?: string;
  cidade_possuidor?: string;
  bairro_possuidor?: string;
  
  // Informações da financeira
  nome_financeira?: string;
  cnpj_financeira?: string;
  endereco_financeira?: string;
  numero_endereco_financeira?: string;
  bairro_financeira?: string;
  complemento_financeira?: string;
  cep_financeira?: string;
  cidade_financeira?: string;
  
  // Fotos do veículo
  fotos_frente?: string[];
  fotos_lateral_esquerda?: string[];
  fotos_lateral_direita?: string[];
  fotos_chassi?: string[];
  fotos_traseira?: string[];
  fotos_motor?: string[];
}

export type VistoriaFormData = Omit<Vistoria, 'id' | 'created_at' | 'updated_at'>;
