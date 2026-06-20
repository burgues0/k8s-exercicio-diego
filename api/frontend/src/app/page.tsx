"use client";

import AppLayout from '@/components/layout-components/applayout';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { obrasService } from '@/services/obrasService';
import { Obra } from '@/types/obras';

interface ObraStats {
  total: number;
  concluidas: number;
  emAndamento: number;
  paralisadas: number;
  planejadas: number;
  investimentoTotal: number;
}

interface ProximaEntrega {
  id: number;
  nome: string;
  data_conclusao: string;
  diasRestantes: number;
}

export default function Home() {
  const [obraStats, setObraStats] = useState<ObraStats>({
    total: 0,
    concluidas: 0,
    emAndamento: 0,
    paralisadas: 0,
    planejadas: 0,
    investimentoTotal: 0
  });
  const [proximasEntregas, setProximasEntregas] = useState<ProximaEntrega[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchObraStats() {
      try {
        const obras: Obra[] = await obrasService.getAllObras();
        
        const stats = obras.reduce((acc, obra) => {
          acc.total += 1;
          
          let gastosAtualizados = 0;
          if (obra.gastos_atualizados !== null && obra.gastos_atualizados !== undefined) {
            gastosAtualizados = Number(obra.gastos_atualizados);
            if (isNaN(gastosAtualizados)) {
              gastosAtualizados = 0;
            }
          } else {
            if (obra.orcamento_total !== null && obra.orcamento_total !== undefined) {
              gastosAtualizados = Number(obra.orcamento_total) || 0;
            }
          }
          
          acc.investimentoTotal += gastosAtualizados;
          
          const status = (obra.status || '').toLowerCase().trim();
          const percentual = Number(obra.percentual_concluido) || 0;
          
          if (status.includes('concluída') || status.includes('concluida') || status === 'concluída' || status === 'concluida' || percentual === 100) {
            acc.concluidas += 1;
          } else if (status.includes('paralisada') || status.includes('pausada') || status === 'paralisada' || status === 'pausada') {
            acc.paralisadas += 1;
          } else if (status.includes('planejada') || status.includes('planejamento') || status === 'planejada' || status === 'planejamento' || percentual === 0) {
            acc.planejadas += 1;
          } else if (status.includes('andamento') || status === 'em andamento' || status === 'andamento' || (percentual > 0 && percentual < 100)) {
            acc.emAndamento += 1;
          } else {
            acc.planejadas += 1;
          }
          
          return acc;
        }, {
          total: 0,
          concluidas: 0,
          emAndamento: 0,
          paralisadas: 0,
          planejadas: 0,
          investimentoTotal: 0
        });

        setObraStats(stats);

        const hoje = new Date();
        const obrasComEntrega = obras
          .filter(obra => obra.data_conclusao && new Date(obra.data_conclusao) >= hoje)
          .map(obra => {
            const dataEntrega = new Date(obra.data_conclusao!);
            const diasRestantes = Math.ceil((dataEntrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            return {
              id: obra.id,
              nome: obra.nome,
              data_conclusao: obra.data_conclusao!,
              diasRestantes
            };
          })
          .sort((a, b) => a.diasRestantes - b.diasRestantes)
          .slice(0, 3);

        setProximasEntregas(obrasComEntrega);
      } catch (error) {
        console.error('Erro ao buscar estatísticas das obras:', error);
      } finally {
        setLoading(false);
      }
    }

    const refreshStats = () => {
      setLoading(true);
      fetchObraStats();
    };

    fetchObraStats();

    const handleObraUpdate = () => {
      setLoading(true);
      setTimeout(() => {
        refreshStats();
      }, 500);
    };

    window.addEventListener('obraUpdated', handleObraUpdate);
    window.addEventListener('obraCreated', handleObraUpdate);
    window.addEventListener('obraDeleted', handleObraUpdate);

    return () => {
      window.removeEventListener('obraUpdated', handleObraUpdate);
      window.removeEventListener('obraCreated', handleObraUpdate);
      window.removeEventListener('obraDeleted', handleObraUpdate);
    };
  }, []);

  const formatCurrency = (value: number) => {
    const numValue = Number(value) || 0;
    
    if (numValue >= 1000000) {
      return `R$ ${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `R$ ${(numValue / 1000).toFixed(1)}K`;
    } else {
      return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCorIndicador = (diasRestantes: number) => {
    if (diasRestantes <= 7) return '#F1860C';
    if (diasRestantes <= 30) return '#2C607A';
    return '#10B981';
  };

  return (
    <AppLayout>
      
      <div className="relative w-full h-[220px] min-h-[220px]">
        <Image
          src="/capa.png"
          alt="Capa obra"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-40 w-full" style={{ maxWidth: 800 }}>
          <h2 className="text-xl font-extrabold text-white mb-1 leading-tight drop-shadow-lg text-left">Indústria<br />Inovação e<br />Infraestrutura</h2>
          <div className="h-4" /> 
          <p className="text-white text-sm font-medium drop-shadow-md text-left">Cada etapa sob controle.<br />Cada obra no caminho certo!</p>
        </div>
      </div>

      {/* Cards de informações */}
      <div className="flex justify-center items-center min-h-[calc(100vh-280px)]">
        <div className="w-full px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            
            {/* Card 1 - Estatísticas de Obras */}
            <div className="rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200" style={{ backgroundColor: '#F9F9F9' }}>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📊 Estatísticas de Obras</h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#F1860C]">
                      {loading ? '...' : obraStats.total}
                    </div>
                    <div className="text-xs text-gray-600">Total de obras</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#2C607A]">
                      {loading ? '...' : obraStats.emAndamento}
                    </div>
                    <div className="text-xs text-gray-600">Andamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {loading ? '...' : obraStats.concluidas}
                    </div>
                    <div className="text-xs text-gray-600">Concluídas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {loading ? '...' : obraStats.paralisadas}
                    </div>
                    <div className="text-xs text-gray-600">Paralisadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold" style={{ color: '#DFB95C' }}>
                      {loading ? '...' : obraStats.planejadas}
                    </div>
                    <div className="text-xs text-gray-600">Planejadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-gray-700">
                      {loading ? '...' : formatCurrency(obraStats.investimentoTotal)}
                    </div>
                    <div className="text-xs text-gray-600">Investimento Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Próximas Entregas */}
            <div className="rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200" style={{ backgroundColor: '#F9F9F9' }}>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1">📅 Próximas Entregas de Obras</h3>
                
                <div className="space-y-2 px-2 mt-3">
                  {loading ? (
                    <div className="text-center text-gray-500">Carregando...</div>
                  ) : proximasEntregas.length > 0 ? (
                    proximasEntregas.slice(0, 3).map((entrega, index) => {
                      const cores = ['#F1860C', '#2C607A', '#22C55E']; // Laranja, Azul, Verde
                      const cor = cores[index] || '#F1860C';
                      return (
                        <div key={entrega.id} className="bg-white rounded-lg p-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-3"
                                style={{ backgroundColor: cor }}
                              ></div>
                              <div className="text-xs font-medium text-gray-800">{entrega.nome}</div>
                            </div>
                            <div className="text-xs font-bold" style={{ color: cor }}>
                              {formatDate(entrega.data_conclusao).split(' ').slice(0, 2).join(' ')}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <div className="text-xs">Nenhuma entrega programada</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}