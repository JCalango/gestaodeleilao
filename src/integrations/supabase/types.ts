export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      damage_assessment_items: {
        Row: {
          assessment_id: string
          category_name: string | null
          created_at: string
          id: string
          item_definition_id: string | null
          item_name: string
          observations: string | null
          photo_url: string | null
          severity: Database["public"]["Enums"]["severity_category"] | null
          status: Database["public"]["Enums"]["damage_status"]
        }
        Insert: {
          assessment_id: string
          category_name?: string | null
          created_at?: string
          id?: string
          item_definition_id?: string | null
          item_name: string
          observations?: string | null
          photo_url?: string | null
          severity?: Database["public"]["Enums"]["severity_category"] | null
          status?: Database["public"]["Enums"]["damage_status"]
        }
        Update: {
          assessment_id?: string
          category_name?: string | null
          created_at?: string
          id?: string
          item_definition_id?: string | null
          item_name?: string
          observations?: string | null
          photo_url?: string | null
          severity?: Database["public"]["Enums"]["severity_category"] | null
          status?: Database["public"]["Enums"]["damage_status"]
        }
        Relationships: [
          {
            foreignKeyName: "damage_assessment_items_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "vehicle_damage_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_assessment_items_item_definition_id_fkey"
            columns: ["item_definition_id"]
            isOneToOne: false
            referencedRelation: "damage_items"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          vehicle_types: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          vehicle_types?: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          vehicle_types?: string[]
        }
        Relationships: []
      }
      damage_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          requires_photo: boolean
          severity_levels: string[]
          vehicle_types: string[]
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          requires_photo?: boolean
          severity_levels?: string[]
          vehicle_types?: string[]
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          requires_photo?: boolean
          severity_levels?: string[]
          vehicle_types?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "damage_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "damage_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inspectors: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          municipality: string
          organization: string
          registration_number: string
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          municipality?: string
          organization?: string
          registration_number: string
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          municipality?: string
          organization?: string
          registration_number?: string
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mototaxi_inspections: {
        Row: {
          auxiliary_driver_cnh: string | null
          auxiliary_driver_cnh_category: string | null
          auxiliary_driver_cnh_expiry: string | null
          auxiliary_driver_cpf: string | null
          auxiliary_driver_name: string | null
          condition_brake_cable: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_light: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_system: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_clutch_cable: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_shock: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_tire: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_headlight: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_horn: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_inspection_seal: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_leg_protector: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_license_plate: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_metal_handles: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_mirrors: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_rear_tire: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_seat: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_speedometer: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_suspension: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tail_lights: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_traction_set: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tread: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_turn_signals: Database["public"]["Enums"]["vehicle_condition_status"]
          created_at: string
          created_by: string | null
          doc_ipva_paid: boolean
          doc_licensing_paid: boolean
          doc_negative_certificates: boolean
          driver_birth_date: string | null
          driver_cnh_category: string
          driver_cnh_expiry: string
          driver_cnh_number: string
          driver_cpf: string
          driver_full_name: string
          driver_has_paid_activity: boolean
          finalized_at: string | null
          has_auxiliary_driver: boolean
          id: string
          inspection_date: string
          inspector_id: string | null
          is_finalized: boolean
          mototaxi_number: string
          observations: string | null
          rejection_reason: string | null
          safety_driver_helmet: boolean
          safety_passenger_helmet: boolean
          safety_retroreflective_helmet: boolean
          safety_retroreflective_vest: boolean
          safety_vest: boolean
          status: Database["public"]["Enums"]["inspection_status"]
          updated_at: string
          vehicle_brand: string
          vehicle_chassis_number: string
          vehicle_color: string
          vehicle_engine_number: string
          vehicle_fuel_type: string
          vehicle_manufacture_year: number
          vehicle_model: string
          vehicle_model_year: number
          vehicle_plate: string
        }
        Insert: {
          auxiliary_driver_cnh?: string | null
          auxiliary_driver_cnh_category?: string | null
          auxiliary_driver_cnh_expiry?: string | null
          auxiliary_driver_cpf?: string | null
          auxiliary_driver_name?: string | null
          condition_brake_cable?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_light?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_system?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_clutch_cable?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_shock?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_tire?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_headlight?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_horn?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_inspection_seal?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_leg_protector?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_license_plate?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_metal_handles?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_mirrors?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_rear_tire?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_seat?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_speedometer?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_suspension?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tail_lights?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_traction_set?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tread?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_turn_signals?: Database["public"]["Enums"]["vehicle_condition_status"]
          created_at?: string
          created_by?: string | null
          doc_ipva_paid?: boolean
          doc_licensing_paid?: boolean
          doc_negative_certificates?: boolean
          driver_birth_date?: string | null
          driver_cnh_category: string
          driver_cnh_expiry: string
          driver_cnh_number: string
          driver_cpf: string
          driver_full_name: string
          driver_has_paid_activity?: boolean
          finalized_at?: string | null
          has_auxiliary_driver?: boolean
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          is_finalized?: boolean
          mototaxi_number: string
          observations?: string | null
          rejection_reason?: string | null
          safety_driver_helmet?: boolean
          safety_passenger_helmet?: boolean
          safety_retroreflective_helmet?: boolean
          safety_retroreflective_vest?: boolean
          safety_vest?: boolean
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
          vehicle_brand: string
          vehicle_chassis_number: string
          vehicle_color: string
          vehicle_engine_number: string
          vehicle_fuel_type: string
          vehicle_manufacture_year: number
          vehicle_model: string
          vehicle_model_year: number
          vehicle_plate: string
        }
        Update: {
          auxiliary_driver_cnh?: string | null
          auxiliary_driver_cnh_category?: string | null
          auxiliary_driver_cnh_expiry?: string | null
          auxiliary_driver_cpf?: string | null
          auxiliary_driver_name?: string | null
          condition_brake_cable?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_light?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_brake_system?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_clutch_cable?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_shock?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_front_tire?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_headlight?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_horn?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_inspection_seal?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_leg_protector?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_license_plate?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_metal_handles?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_mirrors?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_rear_tire?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_seat?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_speedometer?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_suspension?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tail_lights?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_traction_set?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_tread?: Database["public"]["Enums"]["vehicle_condition_status"]
          condition_turn_signals?: Database["public"]["Enums"]["vehicle_condition_status"]
          created_at?: string
          created_by?: string | null
          doc_ipva_paid?: boolean
          doc_licensing_paid?: boolean
          doc_negative_certificates?: boolean
          driver_birth_date?: string | null
          driver_cnh_category?: string
          driver_cnh_expiry?: string
          driver_cnh_number?: string
          driver_cpf?: string
          driver_full_name?: string
          driver_has_paid_activity?: boolean
          finalized_at?: string | null
          has_auxiliary_driver?: boolean
          id?: string
          inspection_date?: string
          inspector_id?: string | null
          is_finalized?: boolean
          mototaxi_number?: string
          observations?: string | null
          rejection_reason?: string | null
          safety_driver_helmet?: boolean
          safety_passenger_helmet?: boolean
          safety_retroreflective_helmet?: boolean
          safety_retroreflective_vest?: boolean
          safety_vest?: boolean
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
          vehicle_brand?: string
          vehicle_chassis_number?: string
          vehicle_color?: string
          vehicle_engine_number?: string
          vehicle_fuel_type?: string
          vehicle_manufacture_year?: number
          vehicle_model?: string
          vehicle_model_year?: number
          vehicle_plate?: string
        }
        Relationships: [
          {
            foreignKeyName: "mototaxi_inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["id"]
          },
        ]
      }
      mototaxistas: {
        Row: {
          atividade_remunerada: boolean
          categoria_cnh: string | null
          cnh: string | null
          cpf: string | null
          created_at: string | null
          foto_3x4_url: string | null
          id: string
          nome: string
          nome_ponto: string
          numero_colete: number
          numero_mototaxi: number
          status_regularidade: string | null
          telefone: string | null
          updated_at: string | null
          validade_cnh: string | null
        }
        Insert: {
          atividade_remunerada?: boolean
          categoria_cnh?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string | null
          foto_3x4_url?: string | null
          id?: string
          nome: string
          nome_ponto: string
          numero_colete: number
          numero_mototaxi: number
          status_regularidade?: string | null
          telefone?: string | null
          updated_at?: string | null
          validade_cnh?: string | null
        }
        Update: {
          atividade_remunerada?: boolean
          categoria_cnh?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string | null
          foto_3x4_url?: string | null
          id?: string
          nome?: string
          nome_ponto?: string
          numero_colete?: number
          numero_mototaxi?: number
          status_regularidade?: string | null
          telefone?: string | null
          updated_at?: string | null
          validade_cnh?: string | null
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
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      vehicle_damage_assessments: {
        Row: {
          assessment_date: string | null
          assessor_name: string | null
          assessor_registration: string | null
          created_at: string
          created_by: string | null
          id: string
          is_completed: boolean
          observations: string | null
          total_na_count: number
          total_nao_count: number
          total_sim_count: number
          updated_at: string
          updated_by: string | null
          vehicle_classification: string | null
          vehicle_type: string
          vistoria_id: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessor_name?: string | null
          assessor_registration?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_completed?: boolean
          observations?: string | null
          total_na_count?: number
          total_nao_count?: number
          total_sim_count?: number
          updated_at?: string
          updated_by?: string | null
          vehicle_classification?: string | null
          vehicle_type: string
          vistoria_id?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessor_name?: string | null
          assessor_registration?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_completed?: boolean
          observations?: string | null
          total_na_count?: number
          total_nao_count?: number
          total_sim_count?: number
          updated_at?: string
          updated_by?: string | null
          vehicle_classification?: string | null
          vehicle_type?: string
          vistoria_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_damage_assessments_vistoria_id_fkey"
            columns: ["vistoria_id"]
            isOneToOne: false
            referencedRelation: "vistorias"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
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
          motor_alterado: string | null
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
          tipo_veiculo: string | null
          uf: string | null
          updated_at: string
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
          created_at?: string
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
          motor_alterado?: string | null
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
          tipo_veiculo?: string | null
          uf?: string | null
          updated_at?: string
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
          created_at?: string
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
          motor_alterado?: string | null
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
          tipo_veiculo?: string | null
          uf?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      formatar_cpf: { Args: { texto: string }; Returns: string }
      get_user_dashboard_data: { Args: { _user_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_activity_type: string
          p_description?: string
          p_metadata?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      damage_status: "SIM" | "NAO" | "NA"
      inspection_status: "aprovado" | "reprovado" | "pendente"
      report_type: "monobloco" | "moto" | "chassi" | "onibus"
      severity_category: "M" | "G"
      sim_nao: "sim" | "nao"
      user_role: "admin" | "member"
      vehicle_condition_status: "bom" | "regular" | "ruim"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      damage_status: ["SIM", "NAO", "NA"],
      inspection_status: ["aprovado", "reprovado", "pendente"],
      report_type: ["monobloco", "moto", "chassi", "onibus"],
      severity_category: ["M", "G"],
      sim_nao: ["sim", "nao"],
      user_role: ["admin", "member"],
      vehicle_condition_status: ["bom", "regular", "ruim"],
    },
  },
} as const
