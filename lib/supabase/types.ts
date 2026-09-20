/**
 * Hand-written to match supabase/migrations/0001_init.sql. Once `supabase start` is
 * runnable in this environment, prefer regenerating this with:
 *   supabase gen types typescript --local > lib/supabase/types.ts
 * and re-apply the "server-only" import note above if the generator strips it.
 *
 * Each table needs `Relationships: []` (even though we don't declare foreign-key
 * relationships here) — supabase-js's generic query builder falls back to `never`
 * without it.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          unit_preference: "km" | "mi";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      strava_connections: {
        Row: {
          id: string;
          user_id: string;
          strava_athlete_id: number;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["strava_connections"]["Row"]
        > & {
          user_id: string;
          strava_athlete_id: number;
          access_token: string;
          refresh_token: string;
          token_expires_at: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["strava_connections"]["Row"]
        >;
        Relationships: [];
      };
      journeys: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          journey_type: "curated" | "custom";
          start_name: string;
          start_lat: number;
          start_lng: number;
          destination_name: string;
          destination_lat: number;
          destination_lng: number;
          total_distance: number;
          route_geometry: Json | null;
          image_url: string | null;
          is_published: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["journeys"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["journeys"]["Row"]>;
        Relationships: [];
      };
      checkpoints: {
        Row: {
          id: string;
          journey_id: string;
          name: string;
          country_code: string;
          sequence_number: number;
          distance_from_start: number;
          lat: number;
          lng: number;
          description: string | null;
          image_url: string | null;
          unlock_content: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["checkpoints"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["checkpoints"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "checkpoints_journey_id_fkey";
            columns: ["journey_id"];
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      user_journeys: {
        Row: {
          id: string;
          user_id: string;
          journey_id: string;
          distance_completed: number;
          started_at: string;
          completed_at: string | null;
          status: "active" | "completed" | "abandoned";
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["user_journeys"]["Row"]
        > & {
          user_id: string;
          journey_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_journeys"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "user_journeys_journey_id_fkey";
            columns: ["journey_id"];
            referencedRelation: "journeys";
            referencedColumns: ["id"];
          },
        ];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          strava_activity_id: number;
          activity_type: string;
          distance: number;
          activity_date: string;
          counted_for_progress: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["activities"]["Row"]> & {
          user_id: string;
          strava_activity_id: number;
          activity_type: string;
          distance: number;
          activity_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["activities"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
