import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  company?: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session & profile
  useEffect(() => {
    let ignore = false;

    async function load() {
      console.log("[Auth] Starting getSession...");

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || null;

      if (ignore) return;
      
      setUser(currentUser);

      if (currentUser) {
        console.log("[Auth] Loading profile for:", currentUser.id);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (ignore) return;

        if (error) {
          console.warn("[Auth] Profile fetch error:", error.message);
        } else {
          console.log("[Auth] Profile loaded:", profileData);
          setProfile(profileData);
        }
      }

      setLoading(false);
      console.log("[Auth] Initialization complete");
    }

    load();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("[Auth] Auth state changed:", _event);
        if (!ignore) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
