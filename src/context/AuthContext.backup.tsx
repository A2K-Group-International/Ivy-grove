import { supabase } from "@/lib/supabase";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "admin" | "teacher" | "parent";

// Define AuthContext
interface AuthContextData {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  enrollPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextData>({
  user: null,
  session: null,
  userRole: null,
  loading: false,
  initializing: true,
  signIn: async () => {},
  enrollPassword: async () => {},
  signOut: async () => {},
});

// Create a provider component that will wrap our app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  console.log("Session", session);
  console.log("User:", user);
  console.log("UserRole:", userRole);

  // Check if user is logged in when app starts
  useEffect(() => {
    setInitializing(true);

    const initAuth = async () => {
      console.log("🔄 InitAuth starting...");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("InitAuth session:", session);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        console.log("InitAuth fetching role for:", session.user.email);
        const role = await fetchUserRole(session?.user?.email);
        console.log(" InitAuth role fetched:", role);
        setUserRole(role);
      } else {
        console.log("InitAuth no session/email, setting role to null");
        setUserRole(null);
      }

      console.log("InitAuth complete");
      setInitializing(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        const role = await fetchUserRole(session?.user?.email);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user by role
  const fetchUserRole = async (email: string): Promise<UserRole | null> => {
    try {
      console.log("Fetching role for email:", email);
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      console.log("Role data from database:", data);

      if (
        data?.role === "admin" ||
        data?.role === "teacher" ||
        data?.role === "parent"
      ) {
        console.log("Role matched, returning:", data.role);
        return data.role as UserRole;
      }

      console.log("Role did not match expected values:", data?.role);
      return null;
    } catch (error) {
      console.error("Unexpected error fetching user role:", error);
      return null;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Set metadata if missing (for existing users)
      if (data.user) {
        if (!data.user.user_metadata?.password_setup_complete) {
          await supabase.auth.updateUser({
            data: {
              ...data.user.user_metadata,
              password_setup_complete: true,
            },
          });
        }
      }
    } catch (error: unknown) {
      const err = error as AuthError;
      console.error("Login failed:", err.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const enrollPassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password,
        data: {
          password_setup_complete: true,
          password_set_at: new Date().toISOString(),
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const err = error as AuthError;
      console.error("Set password Error:", err.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: unknown) {
      const err = error as Error;

      console.error("Signout Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // The value that will be available to all child components
  const value = {
    user,
    session,
    userRole,
    loading,
    initializing,
    signIn,
    enrollPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
