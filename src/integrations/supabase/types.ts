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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      event_plans: {
        Row: {
          created_at: string
          emergency_contact: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          risk_assessment_id: string | null
          staff_lead: string | null
          start_date: string | null
          total_cadets: number | null
          total_staff: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          emergency_contact?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          risk_assessment_id?: string | null
          staff_lead?: string | null
          start_date?: string | null
          total_cadets?: number | null
          total_staff?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          emergency_contact?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          risk_assessment_id?: string | null
          staff_lead?: string | null
          start_date?: string | null
          total_cadets?: number | null
          total_staff?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_plans_risk_assessment_id_fkey"
            columns: ["risk_assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_schedules: {
        Row: {
          activity: string
          created_at: string
          date: string
          end_time: string
          event_plan_id: string
          id: string
          lead_person: string | null
          notes: string | null
          start_time: string
          target_audience: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activity: string
          created_at?: string
          date: string
          end_time: string
          event_plan_id: string
          id?: string
          lead_person?: string | null
          notes?: string | null
          start_time: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activity?: string
          created_at?: string
          date?: string
          end_time?: string
          event_plan_id?: string
          id?: string
          lead_person?: string | null
          notes?: string | null
          start_time?: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_schedules_event_plan_id_fkey"
            columns: ["event_plan_id"]
            isOneToOne: false
            referencedRelation: "event_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      joining_orders: {
        Row: {
          content: Json | null
          created_at: string
          event_plan_id: string
          id: string
          qr_code_data: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          event_plan_id: string
          id?: string
          qr_code_data?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          event_plan_id?: string
          id?: string
          qr_code_data?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "joining_orders_event_plan_id_fkey"
            columns: ["event_plan_id"]
            isOneToOne: false
            referencedRelation: "event_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      kit_lists: {
        Row: {
          activity_type: string | null
          cadet_kit: Json | null
          created_at: string
          event_plan_id: string | null
          id: string
          staff_kit: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activity_type?: string | null
          cadet_kit?: Json | null
          created_at?: string
          event_plan_id?: string | null
          id?: string
          staff_kit?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string | null
          cadet_kit?: Json | null
          created_at?: string
          event_plan_id?: string | null
          id?: string
          staff_kit?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_lists_event_plan_id_fkey"
            columns: ["event_plan_id"]
            isOneToOne: false
            referencedRelation: "event_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_saved_risks: {
        Row: {
          activity_element: string
          additional_control_measures: string | null
          category_id: string
          created_at: string
          existing_control_measures: string
          hazards_identified: string
          id: string
          impact: number
          likelihood: number
          required_actions: string | null
          subcategory_id: string | null
          updated_at: string
          who_might_be_harmed: string
        }
        Insert: {
          activity_element: string
          additional_control_measures?: string | null
          category_id: string
          created_at?: string
          existing_control_measures: string
          hazards_identified: string
          id?: string
          impact: number
          likelihood: number
          required_actions?: string | null
          subcategory_id?: string | null
          updated_at?: string
          who_might_be_harmed: string
        }
        Update: {
          activity_element?: string
          additional_control_measures?: string | null
          category_id?: string
          created_at?: string
          existing_control_measures?: string
          hazards_identified?: string
          id?: string
          impact?: number
          likelihood?: number
          required_actions?: string | null
          subcategory_id?: string | null
          updated_at?: string
          who_might_be_harmed?: string
        }
        Relationships: [
          {
            foreignKeyName: "pre_saved_risks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_saved_risks_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "risk_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          activity_title: string | null
          assessment_date: string | null
          assessor_name: string | null
          created_at: string
          data: Json | null
          id: string
          publications: string | null
          risk_assessment_type: string | null
          squadron: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activity_title?: string | null
          assessment_date?: string | null
          assessor_name?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          publications?: string | null
          risk_assessment_type?: string | null
          squadron?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activity_title?: string | null
          assessment_date?: string | null
          assessor_name?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          publications?: string | null
          risk_assessment_type?: string | null
          squadron?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      risk_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      risk_subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "risk_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_plans: {
        Row: {
          collection_point: string | null
          created_at: string
          departure_time: string | null
          drop_off_point: string | null
          event_plan_id: string
          id: string
          map_link: string | null
          return_time: string | null
          transport_method: string | null
          updated_at: string
          user_id: string | null
          vehicle_details: Json | null
        }
        Insert: {
          collection_point?: string | null
          created_at?: string
          departure_time?: string | null
          drop_off_point?: string | null
          event_plan_id: string
          id?: string
          map_link?: string | null
          return_time?: string | null
          transport_method?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_details?: Json | null
        }
        Update: {
          collection_point?: string | null
          created_at?: string
          departure_time?: string | null
          drop_off_point?: string | null
          event_plan_id?: string
          id?: string
          map_link?: string | null
          return_time?: string | null
          transport_method?: string | null
          updated_at?: string
          user_id?: string | null
          vehicle_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_plans_event_plan_id_fkey"
            columns: ["event_plan_id"]
            isOneToOne: false
            referencedRelation: "event_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      risk_assessment_type: "Generic" | "Specific"
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
      risk_assessment_type: ["Generic", "Specific"],
    },
  },
} as const
