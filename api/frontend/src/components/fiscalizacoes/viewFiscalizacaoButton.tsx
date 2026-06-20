"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Fiscalizacao, FiscalizacaoDetalhes } from "@/types/fiscalizacoes";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { obrasService } from "@/services/obrasService";
import { Eye } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ViewFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
}

const ViewFiscalizacaoButton = ({ fiscalizacao }: ViewFiscalizacaoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detalhes, setDetalhes] = useState<FiscalizacaoDetalhes | null>(null);
  const [obrasCompletas, setObrasCompletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetalhes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let detalhesData: FiscalizacaoDetalhes;
      
      try {
        detalhesData = await fiscalizacoesService.getFiscalizacaoDetalhes(fiscalizacao.id);
      } catch (detalhesError) {
        const fiscalizacaoBasica = await fiscalizacoesService.getFiscalizacaoById(fiscalizacao.id);
        detalhesData = {
          ...fiscalizacaoBasica,
          obras: [],
          responsavelTecnico: undefined,
          responsavel: undefined,
          relatorios: []
        } as FiscalizacaoDetalhes;
      }
      
      setDetalhes(detalhesData);
      
      if (detalhesData.obras && Array.isArray(detalhesData.obras) && detalhesData.obras.length > 0) {
        const obrasCompletasPromises = detalhesData.obras.map(async (obra) => {
          try {
            if (obra && obra.id) {
              const obraCompleta = await obrasService.getObraById(obra.id);
              return obraCompleta;
            }
            return obra;
          } catch (err) {
            return obra;
          }
        });
        
        const obrasCompletasData = await Promise.all(obrasCompletasPromises);
        setObrasCompletas(obrasCompletasData.filter(obra => obra && obra.id));
      } else if (fiscalizacao.obraId || fiscalizacao.obra_id) {
        try {
          const obraId = fiscalizacao.obraId || fiscalizacao.obra_id;
          if (obraId) {
            const obraUnica = await obrasService.getObraById(obraId);
            setObrasCompletas([obraUnica]);
          } else {
            setObrasCompletas([]);
          }
        } catch (err) {
          setObrasCompletas([]);
        }
      } else {
        setObrasCompletas([]);
      }
      
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar detalhes");
      setDetalhes(fiscalizacao as FiscalizacaoDetalhes);
      setObrasCompletas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDetalhes();
    }
  }, [isOpen]);

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'planejada': 'Planejada',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída',
    };
    return statusMap[status] || status;
  };

  const formatRelatorioDate = (relatorio: any) => {
    const dateString = relatorio.dataCriacao || relatorio.data_criacao;
    if (!dateString) return 'Não disponível';
    
    try {
      return formatDateTime(dateString);
    } catch {
      return 'Data inválida';
    }
  };

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Detalhes da Fiscalização</span>
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


            {detalhes && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">ID</label>
                    <p className="text-sm text-gray-600">{detalhes.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <p className="text-sm text-gray-600">{getStatusLabel(detalhes.status)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Título</label>
                  <p className="text-sm text-gray-600">{detalhes.titulo}</p>
                </div>

                {detalhes.descricao && (
                  <div className="mt-4">
                    <label className="text-sm font-medium">Descrição</label>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{detalhes.descricao}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Data de Início</label>
                    <p className="text-sm text-gray-600">{formatDate(detalhes.data_inicio)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data de Fim</label>
                    <p className="text-sm text-gray-600">{formatDate(detalhes.data_fim)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  {detalhes.obraId && (
                    <div>
                      <label className="text-sm font-medium">ID da Obra</label>
                      <p className="text-sm text-gray-600">{detalhes.obraId}</p>
                    </div>
                  )}
                </div>

                {/* Responsável Técnico */}
                {detalhes.responsavelTecnico && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsável Técnico</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">ID do Responsável</label>
                        <p className="text-sm text-gray-600">{detalhes.responsavelTecnico.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nome</label>
                        <p className="text-sm text-gray-600">{detalhes.responsavelTecnico.nome}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">CPF</label>
                        <p className="text-sm text-gray-600">{detalhes.responsavelTecnico.cpf}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Registro Profissional</label>
                        <p className="text-sm text-gray-600">{detalhes.responsavelTecnico.registro_profissional}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Especialidade</label>
                        <p className="text-sm text-gray-600">{detalhes.responsavelTecnico.especialidade}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <p className="text-sm text-gray-600">
                          {detalhes.responsavelTecnico.ativo ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Obras Associadas */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Obras Associadas</h3>
                  
                  {obrasCompletas && obrasCompletas.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-3">Total: {obrasCompletas.length} obra(s)</p>
                      {obrasCompletas.map((obra) => (
                        <div key={obra.id} className="flex items-center justify-between p-3 bg-white rounded border shadow-sm">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{obra.nome}</span>
                              <span className="text-sm text-gray-500">(ID: {obra.id})</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{obra.descricao}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {obra.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {obra.percentual_concluido || 0}% concluído
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>Orçamento: {
                              obra.orcamento_total && !isNaN(parseFloat(obra.orcamento_total)) 
                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(obra.orcamento_total))
                                : 'Não informado'
                            }</div>
                            <div>Gastos: {
                              obra.gastos_atualizados && !isNaN(parseFloat(obra.gastos_atualizados))
                                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(obra.gastos_atualizados))
                                : 'Não informado'
                            }</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 border rounded-md bg-gray-50">
                      <p>Nenhuma obra associada a esta fiscalização</p>
                    </div>
                  )}
                </div>

                {/* Informações do Sistema */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Data de Criação</label>
                      <p className="text-sm text-gray-600">{formatDateTime(detalhes.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Última Atualização</label>
                      <p className="text-sm text-gray-600">{formatDateTime(detalhes.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Relatórios */}
                {detalhes.relatorios && detalhes.relatorios.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios ({detalhes.relatorios.length})</h3>
                    <div className="space-y-3 mt-2">
                      {detalhes.relatorios.map((relatorio, index) => (
                        <div key={relatorio.id} className={`p-3 rounded border ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500">ID</label>
                              <p className="text-sm text-gray-800">{relatorio.id}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Título</label>
                              <p className="text-sm text-gray-800">{relatorio.titulo}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Data do Relatório</label>
                              <p className="text-sm text-gray-800">{formatRelatorioDate(relatorio)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {error && !detalhes && (
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

export default ViewFiscalizacaoButton;
