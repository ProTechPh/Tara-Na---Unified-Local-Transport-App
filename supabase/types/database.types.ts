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
      announcements: {
        Row: {
          body: string | null
          effective_from: string | null
          effective_to: string | null
          id: string
          lgu: string
          severity: string | null
          title: string
        }
        Insert: {
          body?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          lgu: string
          severity?: string | null
          title: string
        }
        Update: {
          body?: string | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          lgu?: string
          severity?: string | null
          title?: string
        }
        Relationships: []
      }
      operators: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          heading: number | null
          id: number
          lat: number
          lng: number
          speed: number | null
          trip_id: string | null
          ts: string | null
        }
        Insert: {
          heading?: number | null
          id?: number
          lat: number
          lng: number
          speed?: number | null
          trip_id?: string | null
          ts?: string | null
        }
        Update: {
          heading?: number | null
          id?: number
          lat?: number
          lng?: number
          speed?: number | null
          trip_id?: string | null
          ts?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          author_id: string | null
          id: string
          location: Json | null
          route_id: string | null
          text: string | null
          trip_id: string | null
          ts: string | null
          type: string
        }
        Insert: {
          author_id?: string | null
          id?: string
          location?: Json | null
          route_id?: string | null
          text?: string | null
          trip_id?: string | null
          ts?: string | null
          type: string
        }
        Update: {
          author_id?: string | null
          id?: string
          location?: Json | null
          route_id?: string | null
          text?: string | null
          trip_id?: string | null
          ts?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          created_at: string | null
          id: string
          lgu: string
          name: string
          polyline: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lgu: string
          name: string
          polyline?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lgu?: string
          name?: string
          polyline?: string | null
          type?: string
        }
        Relationships: []
      }
      stops: {
        Row: {
          created_at: string | null
          id: string
          lat: number
          lng: number
          name: string
          route_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lat: number
          lng: number
          name: string
          route_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lat?: number
          lng?: number
          name?: string
          route_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          ends_at: string | null
          id: string
          operator_id: string | null
          plan: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          ends_at?: string | null
          id?: string
          operator_id?: string | null
          plan?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          ends_at?: string | null
          id?: string
          operator_id?: string | null
          plan?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: string
          route_id: string | null
          status: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          route_id?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          route_id?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string | null
          id: string
          operator_id: string | null
          plate_no: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          operator_id?: string | null
          plate_no?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          operator_id?: string | null
          plate_no?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never