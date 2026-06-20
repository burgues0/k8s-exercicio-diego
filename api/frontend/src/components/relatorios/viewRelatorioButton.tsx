"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Relatorio } from "@/types/relatorios";
import { FiscalizacaoDetalhes } from "@/types/fiscalizacoes";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { obrasService } from "@/services/obrasService";
import { Eye } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

const getDateFromRelatorio = (relatorio: Relatorio): string => {
  const possibleDateFields = [
    'dataCriacao',
    'data_criacao',
    'createdAt', 
    'created_at', 
    'dataCreated', 
    'date_created',
    'createdDate'
  ];
  
  for (const field of possibleDateFields) {
    const value = relatorio[field];
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }
  
  return '';
};

const formatRelatorioDate = (relatorio: Relatorio): string => {
  const dateString = getDateFromRelatorio(relatorio);
  if (!dateString) return 'Não disponível';
  
  try {
    return formatDateTime(dateString);
  } catch {
    return 'Data inválida';
  }
};

interface ViewRelatorioButtonProps {
  relatorio: Relatorio;
}

const ViewRelatorioButton = ({ relatorio }: ViewRelatorioButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fiscalizacaoDetalhes, setFiscalizacaoDetalhes] = useState<FiscalizacaoDetalhes | null>(null);
  const [obrasCompletas, setObrasCompletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiscalizacaoDetalhes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const detalhes = await fiscalizacoesService.getFiscalizacaoDetalhes(relatorio.fiscalizacaoId);
      setFiscalizacaoDetalhes(detalhes);
      
      // Buscar dados completos das obras
      if (detalhes.obras && detalhes.obras.length > 0) {
        const obrasCompletasPromises = detalhes.obras.map(async (obra) => {
          try {
            const obraCompleta = await obrasService.getObraById(obra.id);
            return obraCompleta;
          } catch (err) {
            return obra;
          }
        });
        
        const obrasCompletasData = await Promise.all(obrasCompletasPromises);
        setObrasCompletas(obrasCompletasData);
      } else {
        setObrasCompletas([]);
      }
      
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar detalhes da fiscalização");
      setFiscalizacaoDetalhes(null);
      setObrasCompletas([]);
    } finally {
      setLoading(false);
    }
  }, [relatorio.fiscalizacaoId]);

  useEffect(() => {
    if (isOpen && relatorio.fiscalizacaoId) {
      loadFiscalizacaoDetalhes();
    }
  }, [isOpen, relatorio.fiscalizacaoId, loadFiscalizacaoDetalhes]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Detalhes do Relatório</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-600">Carregando detalhes...</span>
              </div>
            )}

            {/* Informações do Relatório */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Relatório</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ID</label>
                  <p className="text-sm text-gray-600">{relatorio.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">ID da Fiscalização</label>
                  <p className="text-sm text-gray-600">{relatorio.fiscalizacaoId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <p className="text-sm text-gray-600">{relatorio.titulo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Data do Relatório</label>
                  <p className="text-sm text-gray-600">{formatRelatorioDate(relatorio)}</p>
                </div>
              </div>

              {relatorio.conteudo && (
                <div className="mt-4">
                  <label className="text-sm font-medium">Conteúdo</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md mt-1">{relatorio.conteudo}</p>
                </div>
              )}

              {relatorio.createdAt && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Data de Criação do Sistema</label>
                    <p className="text-sm text-gray-600">{formatDateTime(relatorio.createdAt)}</p>
                  </div>
                  {relatorio.updatedAt && (
                    <div>
                      <label className="text-sm font-medium">Última Atualização</label>
                      <p className="text-sm text-gray-600">{formatDateTime(relatorio.updatedAt)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Informações da Fiscalização */}
            {fiscalizacaoDetalhes && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Fiscalização</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">ID</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fiscalizacaoDetalhes.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                      fiscalizacaoDetalhes.status === 'concluida' ? 'bg-green-100 text-green-800' :
                      fiscalizacaoDetalhes.status === 'planejada' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {fiscalizacaoDetalhes.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Título</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.titulo}</p>
                  </div>
                </div>

                {fiscalizacaoDetalhes.descricao && (
                  <div className="mt-4">
                    <label className="text-sm font-medium">Descrição</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md mt-1">{fiscalizacaoDetalhes.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Data Início</label>
                    <p className="text-sm text-gray-600">{formatDate(fiscalizacaoDetalhes.data_inicio)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data Fim</label>
                    <p className="text-sm text-gray-600">{formatDate(fiscalizacaoDetalhes.data_fim)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações do Responsável Técnico */}
            {fiscalizacaoDetalhes?.responsavelTecnico && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsável Técnico</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">ID</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.nome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">CPF</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registro Profissional</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.registro_profissional}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Especialidade</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.especialidade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm text-gray-600">{fiscalizacaoDetalhes.responsavelTecnico.ativo ? 'Ativo' : 'Inativo'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Obras Associadas */}
            {obrasCompletas && obrasCompletas.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Obras Associadas à Fiscalização</h3>
                
                <div className="space-y-4">
                  {obrasCompletas.map((obra) => (
                    <div key={obra.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg">{obra.nome}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          obra.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' :
                          obra.status === 'CONCLUIDA' ? 'bg-green-100 text-green-800' :
                          obra.status === 'PAUSADA' ? 'bg-yellow-100 text-yellow-800' :
                          obra.status === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {obra.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">ID:</span>
                            <span className="ml-2 text-gray-600">{obra.id}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Data Início:</span>
                            <span className="ml-2 text-gray-600">{formatDate(obra.data_inicio)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Data Conclusão:</span>
                            <span className="ml-2 text-gray-600">{formatDate(obra.data_conclusao)}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Orçamento Total:</span>
                            <span className="ml-2 text-gray-600">
                              {obra.orcamento_total && !isNaN(parseFloat(obra.orcamento_total))
                                ? new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(parseFloat(obra.orcamento_total))
                                : 'Não informado'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Gastos Atualizados:</span>
                            <span className="ml-2 text-gray-600">
                              {obra.gastos_atualizados && !isNaN(parseFloat(obra.gastos_atualizados))
                                ? new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  }).format(parseFloat(obra.gastos_atualizados))
                                : 'Não informado'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Percentual Concluído:</span>
                            <span className="ml-2 text-gray-600">{obra.percentual_concluido || 0}%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Latitude:</span>
                            <span className="ml-2 text-gray-600">{obra.latitude}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Longitude:</span>
                            <span className="ml-2 text-gray-600">{obra.longitude}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Endereço ID:</span>
                            <span className="ml-2 text-gray-600">{obra.enderecoId}</span>
                          </div>
                        </div>
                      </div>

                      {obra.descricao && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="font-medium text-gray-700">Descrição:</span>
                          <p className="text-gray-600 mt-1">{obra.descricao}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRelatorioButton;
