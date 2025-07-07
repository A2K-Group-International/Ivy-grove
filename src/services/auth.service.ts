import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "teacher" | "parent";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export class AuthService {
  /**
   * Get current session
   */
  static async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Set metadata if missing (for existing users)
    if (data.user && !data.user.user_metadata?.password_setup_complete) {
      await supabase.auth.updateUser({
        data: {
          ...data.user.user_metadata,
          password_setup_complete: true,
        },
      });
    }

    return data;
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Update user password
   */
  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password: password,
      data: {
        password_setup_complete: true,
        password_set_at: new Date().toISOString(),
      },
    });

    if (error) throw error;
  }

  /**
   * Fetch user profile and role
   */
  static async fetchUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  /**
   * Create new user profile
   */
  static async createUserProfile(
    email: string,
    role: UserRole = "parent"
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        email,
        role,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    email: string,
    role: UserRole
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("email", email)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
