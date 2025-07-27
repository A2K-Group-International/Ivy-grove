import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "teacher" | "parent";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  contact: string;
  address: string;
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
   * Fetch all user profile
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
  static async createAccount(
    id: string,
    email: string,
    first_name: string,
    last_name: string,
    contact: string,
    address: string,
    role: UserRole
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id,
        email,
        first_name,
        last_name,
        contact,
        address,
        role,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create teacher
  static async createTeacher(
    email: string,
    password: string,
    contact: string,
    first_name: string,
    last_name: string,
    address: string
  ): Promise<UserProfile> {
    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Supabase signUp error:", {
          message: error.message,
          details: error,
        });
        throw error;
      }

      if (!data?.user?.id) {
        throw new Error("User id  is not found");
      }

      const profile = await this.createAccount(
        data.user.id,
        email,
        first_name,
        last_name,
        contact,
        address,
        "teacher" // role
      );

      return profile;
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  }

  static async createParent(
    email: string,
    password: string,
    contact: string,
    first_name: string,
    last_name: string,
    address: string
  ): Promise<UserProfile> {
    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Supabase signUp error:", {
          message: error.message,
          details: error,
        });
        throw error;
      }

      if (!data?.user?.id) {
        throw new Error("User id  is not found");
      }

      const profile = await this.createAccount(
        data.user.id,
        email,
        first_name,
        last_name,
        contact,
        address,
        "parent" // role
      );

      return profile;
    } catch (error) {
      console.error("Error creating parent:", error);
      throw error;
    }
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
