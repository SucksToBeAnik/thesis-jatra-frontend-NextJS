export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      group_messages: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string
          sender_username: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          sender_username: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
          sender_username?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "thesis_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_sender_username_fkey"
            columns: ["sender_username"]
            isOneToOne: false
            referencedRelation: "thesis_group_profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      group_projects: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_projects_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "thesis_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      join_group_invitations: {
        Row: {
          created_at: string
          desired_profile_id: string
          id: string
          invitation_details: string
          invitation_status: Database["public"]["Enums"]["join_status"]
          invited_by_group_id: string
          offered_role: Database["public"]["Enums"]["thesis_group_role"]
          rejection_details: string | null
        }
        Insert: {
          created_at?: string
          desired_profile_id: string
          id?: string
          invitation_details: string
          invitation_status?: Database["public"]["Enums"]["join_status"]
          invited_by_group_id: string
          offered_role?: Database["public"]["Enums"]["thesis_group_role"]
          rejection_details?: string | null
        }
        Update: {
          created_at?: string
          desired_profile_id?: string
          id?: string
          invitation_details?: string
          invitation_status?: Database["public"]["Enums"]["join_status"]
          invited_by_group_id?: string
          offered_role?: Database["public"]["Enums"]["thesis_group_role"]
          rejection_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "join_group_invitations_desired_profile_id_fkey"
            columns: ["desired_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_group_invitations_invited_by_group_id_fkey"
            columns: ["invited_by_group_id"]
            isOneToOne: false
            referencedRelation: "thesis_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      join_group_requests: {
        Row: {
          created_at: string
          desired_group_id: string
          id: string
          request_details: string
          request_status: Database["public"]["Enums"]["join_status"]
          requested_by: string
          requested_role: Database["public"]["Enums"]["thesis_group_role"]
          response_details: string | null
        }
        Insert: {
          created_at?: string
          desired_group_id: string
          id?: string
          request_details: string
          request_status?: Database["public"]["Enums"]["join_status"]
          requested_by: string
          requested_role?: Database["public"]["Enums"]["thesis_group_role"]
          response_details?: string | null
        }
        Update: {
          created_at?: string
          desired_group_id?: string
          id?: string
          request_details?: string
          request_status?: Database["public"]["Enums"]["join_status"]
          requested_by?: string
          requested_role?: Database["public"]["Enums"]["thesis_group_role"]
          response_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "join_group_requests_desired_group_id_fkey"
            columns: ["desired_group_id"]
            isOneToOne: false
            referencedRelation: "thesis_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_group_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          fullname: string
          id: string
          linkedin: string | null
          portfolio: string | null
          profile_image_url: string | null
          profile_type: Database["public"]["Enums"]["profile_type"]
          scholar: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          fullname: string
          id?: string
          linkedin?: string | null
          portfolio?: string | null
          profile_image_url?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          scholar?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          fullname?: string
          id?: string
          linkedin?: string | null
          portfolio?: string | null
          profile_image_url?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          scholar?: string | null
        }
        Relationships: []
      }
      project_drafts: {
        Row: {
          content: string | null
          created_at: string
          draft_owner: string
          id: string
          is_public: boolean
          project_id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          draft_owner: string
          id?: string
          is_public?: boolean
          project_id: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          draft_owner?: string
          id?: string
          is_public?: boolean
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_drafts_draft_owner_fkey"
            columns: ["draft_owner"]
            isOneToOne: false
            referencedRelation: "thesis_group_profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "project_drafts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "group_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_goals: {
        Row: {
          created_at: string
          description: string | null
          duration_type: Database["public"]["Enums"]["project_goal_duration_type"]
          id: string
          project_id: string
          proposed_by: string
          status: Database["public"]["Enums"]["project_goal_status"]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_type?: Database["public"]["Enums"]["project_goal_duration_type"]
          id?: string
          project_id: string
          proposed_by: string
          status?: Database["public"]["Enums"]["project_goal_status"]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_type?: Database["public"]["Enums"]["project_goal_duration_type"]
          id?: string
          project_id?: string
          proposed_by?: string
          status?: Database["public"]["Enums"]["project_goal_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_goals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "group_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_goals_proposed_by_fkey"
            columns: ["proposed_by"]
            isOneToOne: false
            referencedRelation: "thesis_group_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_resources: {
        Row: {
          created_at: string
          id: string
          project_id: string
          resource_storage_id: string | null
          resource_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          resource_storage_id?: string | null
          resource_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          resource_storage_id?: string | null
          resource_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_resources_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "group_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_group_profiles: {
        Row: {
          bio: string | null
          created_at: string
          group_id: string
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["thesis_group_role"]
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          group_id: string
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["thesis_group_role"]
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          group_id?: string
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["thesis_group_role"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_group_profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "thesis_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_group_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_groups: {
        Row: {
          bio: string
          created_at: string
          id: string
          name: string
          open_to_join: boolean
          required_members: number
        }
        Insert: {
          bio: string
          created_at?: string
          id?: string
          name: string
          open_to_join?: boolean
          required_members?: number
        }
        Update: {
          bio?: string
          created_at?: string
          id?: string
          name?: string
          open_to_join?: boolean
          required_members?: number
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
      join_status: "PENDING" | "REJECTED" | "APPROVED"
      profile_type: "STUDENT" | "TEACHER" | "TA"
      project_goal_duration_type: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
      project_goal_status: "ONGOING" | "COMPLETED"
      thesis_group_role:
        | "SUPERVISOR"
        | "COSUPERVISOR"
        | "COORDINATOR"
        | "AUTHOR"
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
