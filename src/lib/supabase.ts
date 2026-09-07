import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price: number
          currency: string
          billing_cycle: string
          features: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          currency: string
          billing_cycle: string
          features: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          currency?: string
          billing_cycle?: string
          features?: string[]
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          payfast_token: string | null
          payfast_subscription_id: string | null
          cancel_at_period_end: boolean
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: string
          payfast_token?: string | null
          payfast_subscription_id?: string | null
          cancel_at_period_end?: boolean
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          payfast_token?: string | null
          payfast_subscription_id?: string | null
          cancel_at_period_end?: boolean
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscription_features: {
        Row: {
          id: string
          name: string
          feature_key: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          feature_key: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          feature_key?: string
          created_at?: string
        }
      }
      plan_features: {
        Row: {
          id: string
          plan_id: string
          feature_id: string
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          feature_id: string
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          feature_id?: string
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          priority: string
          status: string
          user_email: string
          user_name: string
          admin_response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          priority?: string
          status?: string
          user_email: string
          user_name: string
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          priority?: string
          status?: string
          user_email?: string
          user_name?: string
          admin_response?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}