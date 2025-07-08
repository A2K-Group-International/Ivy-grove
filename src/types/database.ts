export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      announcement_files: {
        Row: {
          announcement_id: string;
          created_at: string;
          id: string;
          name: string;
          type: string;
          url: string;
        };
        Insert: {
          announcement_id?: string;
          created_at?: string;
          id?: string;
          name: string;
          type: string;
          url: string;
        };
        Update: {
          announcement_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          type?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcement_files_announcement_id_fkey";
            columns: ["announcement_id"];
            isOneToOne: false;
            referencedRelation: "announcements";
            referencedColumns: ["id"];
          }
        ];
      };
      announcements: {
        Row: {
          content: string;
          created_at: string;
          created_by: string;
          group_id: string | null;
          id: string;
          like_count: number | null;
          title: string;
          visibility: Database["public"]["Enums"]["announcement_visibility"];
        };
        Insert: {
          content: string;
          created_at?: string;
          created_by: string;
          group_id?: string | null;
          id?: string;
          like_count?: number | null;
          title: string;
          visibility: Database["public"]["Enums"]["announcement_visibility"];
        };
        Update: {
          content?: string;
          created_at?: string;
          created_by?: string;
          group_id?: string | null;
          id?: string;
          like_count?: number | null;
          title?: string;
          visibility?: Database["public"]["Enums"]["announcement_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "announcement_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_user_id_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      groups: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string;
          id: string;
          image_url: string | null;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description: string;
          id?: string;
          image_url?: string | null;
          name: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          contact: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          role: Database["public"]["Enums"]["roles"];
        };
        Insert: {
          contact: string;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          role?: Database["public"]["Enums"]["roles"];
        };
        Update: {
          contact?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          role?: Database["public"]["Enums"]["roles"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      announcement_visibility: "public" | "private";
      roles: "admin" | "teacher" | "parents";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      announcement_visibility: ["public", "private"],
      roles: ["admin", "teacher", "parents"],
    },
  },
} as const;

export type TableName = keyof Database["public"]["Tables"];

// Create a type that gets the column names and types for a specific table
export type TableColumns<T extends TableName> =
  Database["public"]["Tables"][T]["Row"];
export type ColumnName<T extends TableName> = Extract<
  keyof TableColumns<T>,
  string
>;
export type ColumnValue<
  T extends TableName,
  K extends ColumnName<T>
> = TableColumns<T>[K];
