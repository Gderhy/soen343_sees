import { AuthError, Session, User } from "@supabase/supabase-js";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase, getSystemRole } from "../services/supabase/supabase";
import { useNavigate } from "react-router-dom";
import { SystemRole, SignInProps, SignUpProps } from "../types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  systemRole: SystemRole;
  login: ({ email, password }: SignInProps) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signUp: ({ fullName, email, phone, password }: SignUpProps) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [systemRole, setSystemRole] = useState<SystemRole>("user");

  // ✅ Handle auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);
      else {
        setSession(session);
        setUser(session?.user || null);

        const { systemRole, error } = await getSystemRole(session?.user?.id || "");
        if (error) console.error("Error fetching system role:", error);
        else setSystemRole(systemRole);
      }
    };

    fetchSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    
     // ✅ Fix the cleanup function
    return () => {
      if (data?.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, []);

  // ✅ Login function
  const login = async ({ email, password }: SignInProps) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
      navigate("/");
    }

    return { error };
  };

  // ✅ Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    navigate("/login");
  };

  // ✅ Sign-up function with role assignment
  const signUp = async ({ fullName, email, phone, password }: SignUpProps) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { fullName, phone } },
    });

    if (error) {
      console.error("Sign-up error:", error);
      return { error };
    }

    if (data.user) {
      await supabase.from("system_roles").insert([{ user_id: data.user.id, role: "user" }]);
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, systemRole, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
