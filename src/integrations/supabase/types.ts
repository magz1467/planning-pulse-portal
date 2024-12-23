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
      council_contacts: {
        Row: {
          contact_name: string
          council_name: string
          created_at: string
          email: string
          id: number
          message: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          contact_name: string
          council_name: string
          created_at?: string
          email: string
          id?: number
          message?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          contact_name?: string
          council_name?: string
          created_at?: string
          email?: string
          id?: number
          message?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      developments: {
        Row: {
          address: string | null
          applicant: string | null
          consultation_end: string | null
          created_at: string
          decision_due: string | null
          description: string | null
          external_id: string | null
          id: number
          lat: number | null
          lng: number | null
          officer: string | null
          raw_data: Json | null
          status: string | null
          submission_date: string | null
          title: string
          type: string | null
          updated_at: string
          ward: string | null
        }
        Insert: {
          address?: string | null
          applicant?: string | null
          consultation_end?: string | null
          created_at?: string
          decision_due?: string | null
          description?: string | null
          external_id?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          officer?: string | null
          raw_data?: Json | null
          status?: string | null
          submission_date?: string | null
          title: string
          type?: string | null
          updated_at?: string
          ward?: string | null
        }
        Update: {
          address?: string | null
          applicant?: string | null
          consultation_end?: string | null
          created_at?: string
          decision_due?: string | null
          description?: string | null
          external_id?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          officer?: string | null
          raw_data?: Json | null
          status?: string | null
          submission_date?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      saved_developments: {
        Row: {
          application_id: number
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          application_id: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          application_id?: number
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      Searches: {
        Row: {
          created_at: string
          id: number
          "Post Code": string | null
          Status: string | null
          User_logged_in: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          "Post Code"?: string | null
          Status?: string | null
          User_logged_in?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          "Post Code"?: string | null
          Status?: string | null
          User_logged_in?: boolean | null
        }
        Relationships: []
      }
      "User data": {
        Row: {
          created_at: string
          Email: string | null
          id: number
          Marketing: boolean
          "Post Code": string | null
          Radius_from_pc: number | null
          Type: string | null
        }
        Insert: {
          created_at?: string
          Email?: string | null
          id?: number
          Marketing: boolean
          "Post Code"?: string | null
          Radius_from_pc?: number | null
          Type?: string | null
        }
        Update: {
          created_at?: string
          Email?: string | null
          id?: number
          Marketing?: boolean
          "Post Code"?: string | null
          Radius_from_pc?: number | null
          Type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
