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

  // Function to extract role from user metadata
  const extractUserRole = (user: User | null): UserRole | null => {
    if (!user) return null;
    const role = user.user_metadata?.role || user.app_metadata?.role;
    if (role === "admin" || role === "teacher" || role === "parent") {
      return role as UserRole;
    }
    // Default to 'parent' if no role is set
    return "parent";
  };

  // Check if user is logged in when app starts
  useEffect(() => {
    setInitializing(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractUserRole(session?.user ?? null));

      setInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractUserRole(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, []);

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
