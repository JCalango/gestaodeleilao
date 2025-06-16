export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avarias_auto: {
        Row: {
          classificacao_veiculo: string | null
          created_at: string
          data: string | null
          id: number
          item1: string | null
          item10: string | null
          item11: string | null
          item12: string | null
          item13: string | null
          item14: string | null
          item15: string | null
          item16: string | null
          item17: string | null
          item18: string | null
          item19: string | null
          item2: string | null
          item20: string | null
          item21: string | null
          item22: string | null
          item3: string | null
          item4: string | null
          item5: string | null
          item6: string | null
          item7: string | null
          item8: string | null
          item9: string | null
          lote: string | null
          marca: string | null
          matrícula: string | null
          modelo: string | null
          obs: string | null
          placa: string | null
          qde_na: string | null
          qde_nao: string | null
          qde_sim: string | null
          tipo_de_veículo: string | null
          vistoriador: string | null
        }
        Insert: {
          classificacao_veiculo?: string | null
          created_at?: string
          data?: string | null
          id?: number
          item1?: string | null
          item10?: string | null
          item11?: string | null
          item12?: string | null
          item13?: string | null
          item14?: string | null
          item15?: string | null
          item16?: string | null
          item17?: string | null
          item18?: string | null
          item19?: string | null
          item2?: string | null
          item20?: string | null
          item21?: string | null
          item22?: string | null
          item3?: string | null
          item4?: string | null
          item5?: string | null
          item6?: string | null
          item7?: string | null
          item8?: string | null
          item9?: string | null
          lote?: string | null
          marca?: string | null
          matrícula?: string | null
          modelo?: string | null
          obs?: string | null
          placa?: string | null
          qde_na?: string | null
          qde_nao?: string | null
          qde_sim?: string | null
          tipo_de_veículo?: string | null
          vistoriador?: string | null
        }
        Update: {
          classificacao_veiculo?: string | null
          created_at?: string
          data?: string | null
          id?: number
          item1?: string | null
          item10?: string | null
          item11?: string | null
          item12?: string | null
          item13?: string | null
          item14?: string | null
          item15?: string | null
          item16?: string | null
          item17?: string | null
          item18?: string | null
          item19?: string | null
          item2?: string | null
          item20?: string | null
          item21?: string | null
          item22?: string | null
          item3?: string | null
          item4?: string | null
          item5?: string | null
          item6?: string | null
          item7?: string | null
          item8?: string | null
          item9?: string | null
          lote?: string | null
          marca?: string | null
          matrícula?: string | null
          modelo?: string | null
          obs?: string | null
          placa?: string | null
          qde_na?: string | null
          qde_nao?: string | null
          qde_sim?: string | null
          tipo_de_veículo?: string | null
          vistoriador?: string | null
        }
        Relationships: []
      }
      avarias_moto: {
        Row: {
          classificacao: string | null
          created_at: string
          data: string | null
          id: number
          item1: string | null
          item2: string | null
          item3: string | null
          item4: string | null
          item5: string | null
          item6: string | null
          lote: string | null
          marca: string | null
          matrícula: string | null
          modelo: string | null
          obs: string | null
          placa: string | null
          qde_na: string | null
          qde_nao: string | null
          qde_sim: string | null
          tipo_de_veículo: string | null
          vistoriador: string | null
        }
        Insert: {
          classificacao?: string | null
          created_at?: string
          data?: string | null
          id?: number
          item1?: string | null
          item2?: string | null
          item3?: string | null
          item4?: string | null
          item5?: string | null
          item6?: string | null
          lote?: string | null
          marca?: string | null
          matrícula?: string | null
          modelo?: string | null
          obs?: string | null
          placa?: string | null
          qde_na?: string | null
          qde_nao?: string | null
          qde_sim?: string | null
          tipo_de_veículo?: string | null
          vistoriador?: string | null
        }
        Update: {
          classificacao?: string | null
          created_at?: string
          data?: string | null
          id?: number
          item1?: string | null
          item2?: string | null
          item3?: string | null
          item4?: string | null
          item5?: string | null
          item6?: string | null
          lote?: string | null
          marca?: string | null
          matrícula?: string | null
          modelo?: string | null
          obs?: string | null
          placa?: string | null
          qde_na?: string | null
          qde_nao?: string | null
          qde_sim?: string | null
          tipo_de_veículo?: string | null
          vistoriador?: string | null
        }
        Relationships: []
      }
      Inspec_veícul: {
        Row: {
          alienacao_fid: string | null
          ano_fab: string | null
          ano_mod: string | null
          "bairro_ possuidor": string | null
          bairro_financeira: string | null
          bairro_prop: string | null
          categoria: string | null
          "cep_ possuidor": string | null
          cep_financeira: string | null
          cep_prop: string | null
          "cidade_ possuidor": string | null
          cidade_financeira: string | null
          cidade_prop: string | null
          cnpj_financeira: string | null
          "complemento_ possuidor": string | null
          complemento_financeira: string | null
          complemento_prop: string | null
          Condicao_chassi: string | null
          Condicao_motor: string | null
          cor: string | null
          "cpf_cnpj_ possuidor": string | null
          cpf_cnpj_prop: string | null
          created_at: string
          "endereco_ possuidor": string | null
          endereco_financeira: string | null
          endereco_prop: string | null
          entrada_patio: string | null
          Fotos_Chassi: string | null
          fotos_frente: string | null
          Fotos_lateralD: string | null
          fotos_lateralE: string | null
          Fotos_motor: string | null
          fotos_Vistoria: string | null
          furto_roubo: string | null
          id: number
          infracoes_de_transito: string | null
          ipva: string | null
          licenciamento: string | null
          marca: string | null
          modelo: string | null
          Municipio: string | null
          nome_financeira: string | null
          nome_possuidor: string | null
          nome_proprietario: string | null
          num_chassi: string | null
          num_contro: string | null
          num_financeira: string | null
          num_motor: string | null
          num_prop: string | null
          numero_ende_possuidor: string | null
          observacoes: string | null
          placa: string | null
          renavam: string | null
          rest_judicial: string | null
          restri_adm: string | null
          Tipo_comb: string | null
          tipo_vei: string | null
          uf: string | null
          user: string | null
        }
        Insert: {
          alienacao_fid?: string | null
          ano_fab?: string | null
          ano_mod?: string | null
          "bairro_ possuidor"?: string | null
          bairro_financeira?: string | null
          bairro_prop?: string | null
          categoria?: string | null
          "cep_ possuidor"?: string | null
          cep_financeira?: string | null
          cep_prop?: string | null
          "cidade_ possuidor"?: string | null
          cidade_financeira?: string | null
          cidade_prop?: string | null
          cnpj_financeira?: string | null
          "complemento_ possuidor"?: string | null
          complemento_financeira?: string | null
          complemento_prop?: string | null
          Condicao_chassi?: string | null
          Condicao_motor?: string | null
          cor?: string | null
          "cpf_cnpj_ possuidor"?: string | null
          cpf_cnpj_prop?: string | null
          created_at?: string
          "endereco_ possuidor"?: string | null
          endereco_financeira?: string | null
          endereco_prop?: string | null
          entrada_patio?: string | null
          Fotos_Chassi?: string | null
          fotos_frente?: string | null
          Fotos_lateralD?: string | null
          fotos_lateralE?: string | null
          Fotos_motor?: string | null
          fotos_Vistoria?: string | null
          furto_roubo?: string | null
          id?: number
          infracoes_de_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          Municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          num_chassi?: string | null
          num_contro?: string | null
          num_financeira?: string | null
          num_motor?: string | null
          num_prop?: string | null
          numero_ende_possuidor?: string | null
          observacoes?: string | null
          placa?: string | null
          renavam?: string | null
          rest_judicial?: string | null
          restri_adm?: string | null
          Tipo_comb?: string | null
          tipo_vei?: string | null
          uf?: string | null
          user?: string | null
        }
        Update: {
          alienacao_fid?: string | null
          ano_fab?: string | null
          ano_mod?: string | null
          "bairro_ possuidor"?: string | null
          bairro_financeira?: string | null
          bairro_prop?: string | null
          categoria?: string | null
          "cep_ possuidor"?: string | null
          cep_financeira?: string | null
          cep_prop?: string | null
          "cidade_ possuidor"?: string | null
          cidade_financeira?: string | null
          cidade_prop?: string | null
          cnpj_financeira?: string | null
          "complemento_ possuidor"?: string | null
          complemento_financeira?: string | null
          complemento_prop?: string | null
          Condicao_chassi?: string | null
          Condicao_motor?: string | null
          cor?: string | null
          "cpf_cnpj_ possuidor"?: string | null
          cpf_cnpj_prop?: string | null
          created_at?: string
          "endereco_ possuidor"?: string | null
          endereco_financeira?: string | null
          endereco_prop?: string | null
          entrada_patio?: string | null
          Fotos_Chassi?: string | null
          fotos_frente?: string | null
          Fotos_lateralD?: string | null
          fotos_lateralE?: string | null
          Fotos_motor?: string | null
          fotos_Vistoria?: string | null
          furto_roubo?: string | null
          id?: number
          infracoes_de_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          Municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          num_chassi?: string | null
          num_contro?: string | null
          num_financeira?: string | null
          num_motor?: string | null
          num_prop?: string | null
          numero_ende_possuidor?: string | null
          observacoes?: string | null
          placa?: string | null
          renavam?: string | null
          rest_judicial?: string | null
          restri_adm?: string | null
          Tipo_comb?: string | null
          tipo_vei?: string | null
          uf?: string | null
          user?: string | null
        }
        Relationships: []
      }
      Inspec_veícul_prefeitura: {
        Row: {
          alienacao_fid: string | null
          ano_fab: string | null
          ano_mod: string | null
          "bairro_ possuidor": string | null
          bairro_financeira: string | null
          bairro_prop: string | null
          categoria: string | null
          "cep_ possuidor": string | null
          cep_financeira: string | null
          cep_prop: string | null
          "cidade_ possuidor": string | null
          cidade_financeira: string | null
          cidade_prop: string | null
          cnpj_financeira: string | null
          "complemento_ possuidor": string | null
          complemento_financeira: string | null
          complemento_prop: string | null
          Condicao_chassi: string | null
          Condicao_motor: string | null
          cor: string | null
          "cpf_cnpj_ possuidor": string | null
          cpf_cnpj_prop: string | null
          created_at: string
          "endereco_ possuidor": string | null
          endereco_financeira: string | null
          endereco_prop: string | null
          entrada_patio: string | null
          Fotos_Chassi: string | null
          fotos_frente: string | null
          Fotos_lateralD: string | null
          fotos_lateralE: string | null
          Fotos_motor: string | null
          fotos_Vistoria: string | null
          furto_roubo: string | null
          id: number
          infracoes_de_transito: string | null
          ipva: string | null
          licenciamento: string | null
          marca: string | null
          modelo: string | null
          Municipio: string | null
          nome_financeira: string | null
          nome_possuidor: string | null
          nome_proprietario: string | null
          num_chassi: string | null
          num_contro: string | null
          num_financeira: string | null
          num_motor: string | null
          num_prop: string | null
          numero_ende_possuidor: string | null
          observacoes: string | null
          placa: string | null
          renavam: string | null
          rest_judicial: string | null
          restri_adm: string | null
          Tipo_comb: string | null
          tipo_vei: string | null
          uf: string | null
          user: string | null
        }
        Insert: {
          alienacao_fid?: string | null
          ano_fab?: string | null
          ano_mod?: string | null
          "bairro_ possuidor"?: string | null
          bairro_financeira?: string | null
          bairro_prop?: string | null
          categoria?: string | null
          "cep_ possuidor"?: string | null
          cep_financeira?: string | null
          cep_prop?: string | null
          "cidade_ possuidor"?: string | null
          cidade_financeira?: string | null
          cidade_prop?: string | null
          cnpj_financeira?: string | null
          "complemento_ possuidor"?: string | null
          complemento_financeira?: string | null
          complemento_prop?: string | null
          Condicao_chassi?: string | null
          Condicao_motor?: string | null
          cor?: string | null
          "cpf_cnpj_ possuidor"?: string | null
          cpf_cnpj_prop?: string | null
          created_at?: string
          "endereco_ possuidor"?: string | null
          endereco_financeira?: string | null
          endereco_prop?: string | null
          entrada_patio?: string | null
          Fotos_Chassi?: string | null
          fotos_frente?: string | null
          Fotos_lateralD?: string | null
          fotos_lateralE?: string | null
          Fotos_motor?: string | null
          fotos_Vistoria?: string | null
          furto_roubo?: string | null
          id?: number
          infracoes_de_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          Municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          num_chassi?: string | null
          num_contro?: string | null
          num_financeira?: string | null
          num_motor?: string | null
          num_prop?: string | null
          numero_ende_possuidor?: string | null
          observacoes?: string | null
          placa?: string | null
          renavam?: string | null
          rest_judicial?: string | null
          restri_adm?: string | null
          Tipo_comb?: string | null
          tipo_vei?: string | null
          uf?: string | null
          user?: string | null
        }
        Update: {
          alienacao_fid?: string | null
          ano_fab?: string | null
          ano_mod?: string | null
          "bairro_ possuidor"?: string | null
          bairro_financeira?: string | null
          bairro_prop?: string | null
          categoria?: string | null
          "cep_ possuidor"?: string | null
          cep_financeira?: string | null
          cep_prop?: string | null
          "cidade_ possuidor"?: string | null
          cidade_financeira?: string | null
          cidade_prop?: string | null
          cnpj_financeira?: string | null
          "complemento_ possuidor"?: string | null
          complemento_financeira?: string | null
          complemento_prop?: string | null
          Condicao_chassi?: string | null
          Condicao_motor?: string | null
          cor?: string | null
          "cpf_cnpj_ possuidor"?: string | null
          cpf_cnpj_prop?: string | null
          created_at?: string
          "endereco_ possuidor"?: string | null
          endereco_financeira?: string | null
          endereco_prop?: string | null
          entrada_patio?: string | null
          Fotos_Chassi?: string | null
          fotos_frente?: string | null
          Fotos_lateralD?: string | null
          fotos_lateralE?: string | null
          Fotos_motor?: string | null
          fotos_Vistoria?: string | null
          furto_roubo?: string | null
          id?: number
          infracoes_de_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          Municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          num_chassi?: string | null
          num_contro?: string | null
          num_financeira?: string | null
          num_motor?: string | null
          num_prop?: string | null
          numero_ende_possuidor?: string | null
          observacoes?: string | null
          placa?: string | null
          renavam?: string | null
          rest_judicial?: string | null
          restri_adm?: string | null
          Tipo_comb?: string | null
          tipo_vei?: string | null
          uf?: string | null
          user?: string | null
        }
        Relationships: []
      }
      new_user: {
        Row: {
          created_at: string
          id: number
          matrícula: string | null
          nome: string | null
          user_ref: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          matrícula?: string | null
          nome?: string | null
          user_ref?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          matrícula?: string | null
          nome?: string | null
          user_ref?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      vistorias: {
        Row: {
          alienacao_fiduciaria: boolean | null
          ano_fabricacao: number | null
          ano_modelo: number | null
          bairro_financeira: string | null
          bairro_possuidor: string | null
          bairro_proprietario: string | null
          categoria: string | null
          cep_financeira: string | null
          cep_possuidor: string | null
          cep_proprietario: string | null
          cidade_financeira: string | null
          cidade_possuidor: string | null
          cidade_proprietario: string | null
          cnpj_financeira: string | null
          complemento_financeira: string | null
          complemento_proprietario: string | null
          condicao_chassi: string | null
          condicao_motor: string | null
          cor: string | null
          cpf_cnpj_possuidor: string | null
          cpf_cnpj_proprietario: string | null
          created_at: string | null
          created_by: string | null
          dados_remocao: string | null
          data_entrada_patio: string | null
          data_inspecao: string | null
          debito_patio: number | null
          endereco_financeira: string | null
          endereco_possuidor: string | null
          endereco_proprietario: string | null
          fotos_chassi: string[] | null
          fotos_frente: string[] | null
          fotos_lateral_direita: string[] | null
          fotos_lateral_esquerda: string[] | null
          fotos_motor: string[] | null
          fotos_traseira: string[] | null
          furto_roubo: boolean | null
          id: string
          informacoes_complementares_possuidor: string | null
          informacoes_complementares_proprietario: string | null
          infracoes_transito: string | null
          ipva: string | null
          licenciamento: string | null
          marca: string | null
          modelo: string | null
          municipio: string | null
          nome_financeira: string | null
          nome_possuidor: string | null
          nome_proprietario: string | null
          numero_casa_proprietario: string | null
          numero_chassi: string | null
          numero_controle: string
          numero_endereco_financeira: string | null
          numero_motor: string | null
          observacoes: string | null
          placa: string | null
          possui_comunicacao_venda: boolean | null
          renavam: string | null
          restricao_administrativa: boolean | null
          restricao_judicial: boolean | null
          tipo_combustivel: string | null
          uf: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          alienacao_fiduciaria?: boolean | null
          ano_fabricacao?: number | null
          ano_modelo?: number | null
          bairro_financeira?: string | null
          bairro_possuidor?: string | null
          bairro_proprietario?: string | null
          categoria?: string | null
          cep_financeira?: string | null
          cep_possuidor?: string | null
          cep_proprietario?: string | null
          cidade_financeira?: string | null
          cidade_possuidor?: string | null
          cidade_proprietario?: string | null
          cnpj_financeira?: string | null
          complemento_financeira?: string | null
          complemento_proprietario?: string | null
          condicao_chassi?: string | null
          condicao_motor?: string | null
          cor?: string | null
          cpf_cnpj_possuidor?: string | null
          cpf_cnpj_proprietario?: string | null
          created_at?: string | null
          created_by?: string | null
          dados_remocao?: string | null
          data_entrada_patio?: string | null
          data_inspecao?: string | null
          debito_patio?: number | null
          endereco_financeira?: string | null
          endereco_possuidor?: string | null
          endereco_proprietario?: string | null
          fotos_chassi?: string[] | null
          fotos_frente?: string[] | null
          fotos_lateral_direita?: string[] | null
          fotos_lateral_esquerda?: string[] | null
          fotos_motor?: string[] | null
          fotos_traseira?: string[] | null
          furto_roubo?: boolean | null
          id?: string
          informacoes_complementares_possuidor?: string | null
          informacoes_complementares_proprietario?: string | null
          infracoes_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          numero_casa_proprietario?: string | null
          numero_chassi?: string | null
          numero_controle: string
          numero_endereco_financeira?: string | null
          numero_motor?: string | null
          observacoes?: string | null
          placa?: string | null
          possui_comunicacao_venda?: boolean | null
          renavam?: string | null
          restricao_administrativa?: boolean | null
          restricao_judicial?: boolean | null
          tipo_combustivel?: string | null
          uf?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          alienacao_fiduciaria?: boolean | null
          ano_fabricacao?: number | null
          ano_modelo?: number | null
          bairro_financeira?: string | null
          bairro_possuidor?: string | null
          bairro_proprietario?: string | null
          categoria?: string | null
          cep_financeira?: string | null
          cep_possuidor?: string | null
          cep_proprietario?: string | null
          cidade_financeira?: string | null
          cidade_possuidor?: string | null
          cidade_proprietario?: string | null
          cnpj_financeira?: string | null
          complemento_financeira?: string | null
          complemento_proprietario?: string | null
          condicao_chassi?: string | null
          condicao_motor?: string | null
          cor?: string | null
          cpf_cnpj_possuidor?: string | null
          cpf_cnpj_proprietario?: string | null
          created_at?: string | null
          created_by?: string | null
          dados_remocao?: string | null
          data_entrada_patio?: string | null
          data_inspecao?: string | null
          debito_patio?: number | null
          endereco_financeira?: string | null
          endereco_possuidor?: string | null
          endereco_proprietario?: string | null
          fotos_chassi?: string[] | null
          fotos_frente?: string[] | null
          fotos_lateral_direita?: string[] | null
          fotos_lateral_esquerda?: string[] | null
          fotos_motor?: string[] | null
          fotos_traseira?: string[] | null
          furto_roubo?: boolean | null
          id?: string
          informacoes_complementares_possuidor?: string | null
          informacoes_complementares_proprietario?: string | null
          infracoes_transito?: string | null
          ipva?: string | null
          licenciamento?: string | null
          marca?: string | null
          modelo?: string | null
          municipio?: string | null
          nome_financeira?: string | null
          nome_possuidor?: string | null
          nome_proprietario?: string | null
          numero_casa_proprietario?: string | null
          numero_chassi?: string | null
          numero_controle?: string
          numero_endereco_financeira?: string | null
          numero_motor?: string | null
          observacoes?: string | null
          placa?: string | null
          possui_comunicacao_venda?: boolean | null
          renavam?: string | null
          restricao_administrativa?: boolean | null
          restricao_judicial?: boolean | null
          tipo_combustivel?: string | null
          uf?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      damage_status: "SIM" | "NAO" | "NA"
      report_type: "monobloco" | "moto" | "chassi" | "onibus"
      severity_category: "M" | "G"
      sim_nao: "sim" | "nao"
      user_role: "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      damage_status: ["SIM", "NAO", "NA"],
      report_type: ["monobloco", "moto", "chassi", "onibus"],
      severity_category: ["M", "G"],
      sim_nao: ["sim", "nao"],
      user_role: ["admin", "member"],
    },
  },
} as const
