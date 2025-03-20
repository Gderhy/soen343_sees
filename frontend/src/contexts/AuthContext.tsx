import { AuthError, User } from "@supabase/supabase-js";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { SignInProps, SignUpProps } from "../types";

interface AuthContextType {
  login: ({ email, password }: SignInProps) => Promise<{ error: AuthError | null }>;
  logout: () => void;
  user: User | null;
  signUp: ({
    fullName,
    email,
    phone,
    password,
  }: SignUpProps) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        setUser(session.user);
      }
    };

    checkSession();
  }, []);

  const login = async ({ email, password }: SignInProps) => {
    if (user) {
      navigate("/");
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (data?.session) {
      setUser(data.session.user);
    }

    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const signUp = async ({ fullName, email, phone, password }: SignUpProps) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { fullName, phone } }, // phone does not link to user (has to do with activating phone number)
    });

    if (error) {
      console.error("Sign-up error:", error);
      return { error };
    }

    if (data.session) {
      // If a session is returned, the user is logged in automatically (email confirmation disabled)
      setUser(data.session.user);
      navigate("/"); // Navigate to the home page or dashboard
    } else {
      // If no session is returned, email confirmation is enabled
      alert("Please check your email to confirm your account.");
      navigate("/login"); // Redirect to the login page
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
