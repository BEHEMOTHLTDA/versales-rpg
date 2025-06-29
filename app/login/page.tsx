// src/app/login/page.tsx
"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

// Este componente é a nossa página de login estilizada
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      router.push("/perfil");
    } catch (err: any) {
      setError(
        "Erro ao forjar conta. O email já pode estar em uso ou a senha é muito fraca."
      );
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/perfil"); // Redireciona após login
    } catch (err: any) {
      setError("Credenciais inválidas. Verifique seu email e senha.");
    }
  };

  return (
    // Mantendo o fundo escuro global que definimos
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ fontFamily: "'Source Serif Pro', serif" }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-black/50 rounded-lg shadow-lg border border-red-900/30 backdrop-blur-sm">
        <div className="text-center">
          <h1
            className="text-4xl font-bold text-gray-200"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            VERSALES
          </h1>
          <p className="text-red-400/70 text-sm">Suas crônicas, seu legado.</p>
        </div>

        {/* ================================================= */}
        {/* == NOVO BLOCO DE AVISO ADICIONADO AQUI == */}
        <div className="p-3 text-center border-t border-b border-red-900/50 bg-black/20">
          <p className="text-sm text-gray-300">
            Você acessará o Grimório com sua{" "}
            <strong className="font-bold text-white">Conta-CoffeeChroma</strong>
            . Se já possui uma, basta fazer o login.
          </p>
        </div>
        {/* ================================================= */}

        <form className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 bg-[#111] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-900/80 text-gray-200"
              placeholder="escriba@dominio.com"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-400">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 bg-[#111] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-900/80 text-gray-200"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          <div className="flex flex-col space-y-4 pt-4">
            <button
              onClick={handleLogin}
              className="w-full py-3 font-bold bg-gray-300 text-black rounded hover:bg-white transition-colors duration-300"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Entrar no Grimório
            </button>
            <button
              onClick={handleRegister}
              className="w-full py-2 font-bold text-gray-400 bg-transparent border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition-colors duration-300"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Forjar Nova Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
