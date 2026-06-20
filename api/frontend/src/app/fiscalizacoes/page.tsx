"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from '@/components/layout-components/applayout';
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import FiscalizacoesDataTable from "@/components/fiscalizacoes/fiscalizacoesDataTable";
import CreateFiscalizacaoButton from "@/components/fiscalizacoes/createFiscalizacaoButton";
import RecentFiscalizacoesButton from "@/components/fiscalizacoes/recentFiscalizacoesButton";
import { DeleteFiscalizacoesObraPageButton } from "@/components/fiscalizacoes/deleteFiscalizacoesObraPageButton";
import { ClipboardCheck } from "lucide-react";

export default function FiscalizacoesPage() {
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiscalizacoes = async () => {
    try {
      setLoading(true);
      const data = await fiscalizacoesService.getAllFiscalizacoes();
      
      const sortedData = data.sort((a, b) => a.id - b.id);
      setFiscalizacoes(sortedData);
      setError(null);
    } catch (err: unknown) {
      const error = err as any;
      console.error('Erro ao carregar fiscalizações:', error);
      
      // Tratamento específico para erro de autenticação
      if (error?.status === 401 || error?.message?.includes('Unauthorized') || error?.message?.includes('Token ausente')) {
        setError('Acesso não autorizado. Faça login para acessar as fiscalizações.');
      } else if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError(error?.message || 'Erro ao carregar fiscalizações. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiscalizacoes();
  }, []);

  const handleSuccess = () => {
    loadFiscalizacoes();
  };

  return (
    <AppLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header da Página */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fiscalizações</h1>
            <p className="text-gray-600">Gerencie as fiscalizações cadastradas no sistema</p>
          </div>
          <div className="flex gap-3">
            <RecentFiscalizacoesButton onSuccess={handleSuccess} />
            <DeleteFiscalizacoesObraPageButton onSuccess={handleSuccess} />
            <CreateFiscalizacaoButton onSuccess={handleSuccess} />
          </div>
        </div>

        {/* Card Principal */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6" />
              Lista de Fiscalizações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Carregando fiscalizações...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-800 font-medium">Erro ao carregar fiscalizações</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !error && (
              <FiscalizacoesDataTable 
                fiscalizacoes={fiscalizacoes} 
                onSuccess={handleSuccess} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
