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
