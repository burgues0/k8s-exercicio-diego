"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { AuthService } from "@/lib/api";

// Salva o token no localStorage também, para compatibilidade com o novo serviço
function setAuthToken(token: string) {
  document.cookie = `auth-token=${token}; path=/; max-age=86400`;
  localStorage.setItem('auth-token', token);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const data = await AuthService.login(email, password);
      setAuthToken(data.token);
      const redirectTo = searchParams.get("redirect") || "/";
      window.location.href = redirectTo;
    } catch (err: unknown) {
      const error = err as Error & { status?: number; statusText?: string; data?: unknown };
      console.error('Erro de autenticação:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data,
        fullError: error
      });
      
      if (error.message && !error.message.includes('Erro HTTP')) {
        setError(error.message);
      } else {
        switch (error.status) {
          case 401:
            setError("Credenciais inválidas. Verifique seu email e senha.");
            break;
          case 403:
            setError("Acesso negado. Conta não autorizada.");
            break;
          case 404:
            setError("Serviço de autenticação não encontrado.");
            break;
          case 500:
            setError("Erro interno do servidor. Tente novamente mais tarde.");
            break;
          case 0:
            setError("Erro de conexão. Verifique se o servidor está rodando.");
            break;
          default:
            setError("Erro ao fazer login. Tente novamente.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F9F9F9' }}>
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-md relative z-20 p-2">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-3xl text-center font-extrabold tracking-tight font-[Poppins,Inter,sans-serif]" style={{ color: '#2C607A' }}>Login</CardTitle>
          <CardDescription className="text-center text-gray-500 text-base">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-black font-[Poppins,Inter,sans-serif]">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F1860C]">
                  <User className="h-5 w-5" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  className="pl-11 py-5 bg-white !bg-white border-2 border-gray-300 rounded-xl focus:border-[#F1860C] focus:ring-[#F1860C]/30 text-black placeholder:text-gray-300 transition-all font-sans placeholder:text-gray-300 text-lg"
                  style={{ fontFamily: 'Inter, Arial, sans-serif' }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-black font-[Poppins,Inter,sans-serif]">Senha</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F1860C]">
                  <Lock className="h-5 w-5" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="pl-11 py-5 bg-white !bg-white border-2 border-gray-300 rounded-xl focus:border-[#F1860C] focus:ring-[#F1860C]/30 text-black placeholder:text-gray-300 transition-all font-sans placeholder:text-gray-300 text-lg"
                  style={{ fontFamily: 'Inter, Arial, sans-serif' }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full bg-[#F1860C] hover:bg-[#d97706] text-white font-bold shadow-lg rounded-xl py-3 text-lg transition-colors" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
