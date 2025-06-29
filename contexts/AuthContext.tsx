// src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { supabase } from "@/lib/supabase/client"; // Importar Supabase

type AuthUser = User & { username?: string }; // Estende o tipo User para incluir o username

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Se o usuário está logado, busca o perfil no Supabase para pegar o username
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", firebaseUser.uid)
          .single();

        setUser({ ...firebaseUser, username: profile?.username });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          Carregando Grimório...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
