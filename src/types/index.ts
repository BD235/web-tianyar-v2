
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          id: string
          category_id: string | null
          title: string
          description: string
          price: number | null
          operational_hours: string
          latitude: number
          longitude: number
          images: string[] | null
          facilities: Json | null
          tips_and_rules: string | null
          is_popular: boolean | null
          map_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          description: string
          price?: number | null
          operational_hours: string
          latitude: number
          longitude: number
          images?: string[] | null
          facilities?: Json | null
          tips_and_rules?: string | null
          is_popular?: boolean | null
          map_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          description?: string
          price?: number | null
          operational_hours?: string
          latitude?: number
          longitude?: number
          images?: string[] | null
          facilities?: Json | null
          tips_and_rules?: string | null
          is_popular?: boolean | null
          map_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destinations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Destination = Database['public']['Tables']['destinations']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
