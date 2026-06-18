// src/types/index.ts

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
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}

// Helper types untuk digunakan di komponen
export type Destination = Database['public']['Tables']['destinations']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
