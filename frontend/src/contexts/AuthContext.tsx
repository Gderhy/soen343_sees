import { AuthError, Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../services/supabase/supabase";
import { useNavigate } from "react-router-dom";
import { SignInProps, SignUpProps, SystemRole } from "../types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: ({
    email,
    password,
  }: SignInProps) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signUp: ({
    fullName,
    email,
    phone,
    password,
    systemRole,
  }: SignUpProps) => Promise<{ error: AuthError | null }>;
  getUserSystemRole: () => SystemRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
    };

    fetchSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async ({ email, password }: SignInProps) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      navigate("/");
    }

    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    navigate("/login");
  };

  const signUp = async ({
    fullName,
    email,
    phone,
    password,
    systemRole = "user",
  }: SignUpProps) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName, phone, systemRole },
      },
    });

    if (error) {
      console.error("Sign-up error:", error);
      return { error };
    }

    return { error: null };
  };

  const getUserSystemRole = () => {
    return (user?.user_metadata?.systemRole || "user") as SystemRole ;
  };

  return (
    <AuthContext.Provider
      value={{ user, session, login, logout, signUp, getUserSystemRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
