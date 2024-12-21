// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Table interfaces
interface SearchesTable {
  Row: {
    id: number
    created_at: string
    "Post Code": string | null
    Status: string | null
    User_logged_in: boolean | null
  }
  Insert: {
    id?: number
    created_at?: string
    "Post Code"?: string | null
    Status?: string | null
    User_logged_in?: boolean | null
  }
  Update: {
    id?: number
    created_at?: string
    "Post Code"?: string | null
    Status?: string | null
    User_logged_in?: boolean | null
  }
}

interface UserDataTable {
  Row: {
    id: number
    created_at: string
    Email: string | null
    Type: string | null
    Marketing: boolean
    "Post Code": string | null
    Radius_from_pc: number | null
  }
  Insert: {
    id?: number
    created_at?: string
    Email?: string | null
    Type?: string | null
    Marketing: boolean
    "Post Code"?: string | null
    Radius_from_pc?: number | null
  }
  Update: {
    id?: number
    created_at?: string
    Email?: string | null
    Type?: string | null
    Marketing?: boolean
    "Post Code"?: string | null
    Radius_from_pc?: number | null
  }
}

interface SavedDevelopmentsTable {
  Row: {
    id: number
    created_at: string
    user_id: string | null
    application_id: number
  }
  Insert: {
    id?: number
    created_at?: string
    user_id?: string | null
    application_id: number
  }
  Update: {
    id?: number
    created_at?: string
    user_id?: string | null
    application_id?: number
  }
}

interface CouncilContactsTable {
  Row: {
    id: number
    created_at: string
    council_name: string
    contact_name: string
    email: string
    phone: string | null
    message: string | null
    status: string | null
  }
  Insert: {
    id?: number
    created_at?: string
    council_name: string
    contact_name: string
    email: string
    phone?: string | null
    message?: string | null
    status?: string | null
  }
  Update: {
    id?: number
    created_at?: string
    council_name?: string
    contact_name?: string
    email?: string
    phone?: string | null
    message?: string | null
    status?: string | null
  }
}

// Database interface
export interface Database {
  public: {
    Tables: {
      Searches: SearchesTable
      "User data": UserDataTable
      saved_developments: SavedDevelopmentsTable
      council_contacts: CouncilContactsTable
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Export table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']