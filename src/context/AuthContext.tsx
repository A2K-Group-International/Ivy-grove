import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AuthService,
  type UserRole,
  type UserProfile,
} from "@/services/auth.service";
import {
  useSession,
  useUserProfile,
  useAuthQueries,
  AUTH_KEYS,
} from "@/hooks/useAuth";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextData {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  enrollPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({
  user: null,
  session: null,
  userRole: null,
  userProfile: null,
  loading: false,
  initializing: true,
  signIn: async () => {},
  enrollPassword: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const queryClient = useQueryClient();
  const { invalidateAll, invalidateSession, invalidateProfile } =
    useAuthQueries();

  // Get session data
  const { data: session, isLoading: sessionLoading } = useSession();

  // Get user profile data
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(
    session?.user?.id
  );

  // Derived values
  const user = session?.user || null;
  const userRole = userProfile?.role ?? null;

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      // Update session in cache
      queryClient.setQueryData(AUTH_KEYS.session, session);

      // If user logs out, clear all auth data
      if (event === "SIGNED_OUT") {
        invalidateAll();
      }

      // If user signs in, fetch their profile
      if (event === "SIGNED_IN" && session?.user?.id) {
        invalidateProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, invalidateAll, invalidateProfile]);

  // Handle initialization
  useEffect(() => {
    if (!sessionLoading) {
      setInitializing(false);
    }
  }, [sessionLoading]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await AuthService.signIn(email, password);

      // Invalidate session to refetch
      invalidateSession();

      // Invalidate profile to refetch
      invalidateProfile(email);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const enrollPassword = async (password: string) => {
    try {
      setLoading(true);
      await AuthService.updatePassword(password);

      // Invalidate session to refetch
      invalidateSession();
    } catch (error) {
      console.error("Password update failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();

      // Clear all auth data
      invalidateAll();
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session: session ?? null,
    userRole,
    userProfile: userProfile ?? null,
    loading: loading || sessionLoading || profileLoading,
    initializing,
    signIn,
    enrollPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { UserRole };
