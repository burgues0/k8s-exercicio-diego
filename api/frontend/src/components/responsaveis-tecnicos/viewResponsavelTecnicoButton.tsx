"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ResponsavelTecnico, Obra } from "@/types/responsaveis-tecnicos";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";
import { Eye } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

interface ViewResponsavelTecnicoButtonProps {
  responsavel: ResponsavelTecnico;
}

const ViewResponsavelTecnicoButton = ({ responsavel }: ViewResponsavelTecnicoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detalhes, setDetalhes] = useState<ResponsavelTecnico | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingObras, setLoadingObras] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetalhes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const responsavelData = await responsaveisTecnicosService.getResponsavelTecnicoById(responsavel.id);
      setDetalhes(responsavelData);
      
      setLoadingObras(true);
      
      try {
        const obrasData = await responsaveisTecnicosService.getObrasDoResponsavelTecnico(responsavel.id);
        setObras(obrasData);
      } catch (obrasErr: unknown) {
        setObras([]);
      } finally {
        setLoadingObras(false);
      }
      
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar detalhes");
      setDetalhes(responsavel);
      setObras([]);
      setLoadingObras(false);
    } finally {
      setLoading(false);
    }
  }, [responsavel.id, responsavel]);

  useEffect(() => {
    if (isOpen) {
      loadDetalhes();
    }
  }, [isOpen, responsavel.id, loadDetalhes]);

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
            <span>Detalhes do Responsável Técnico</span>
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
                    <p className="text-sm text-gray-600">{detalhes.ativo ? 'Ativo' : 'Inativo'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-sm text-gray-600">{detalhes.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Especialidade</label>
                    <p className="text-sm text-gray-600">{detalhes.especialidade}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">CPF</label>
                    <p className="text-sm text-gray-600">{detalhes.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Registro Profissional</label>
                    <p className="text-sm text-gray-600">{detalhes.registro_profissional}</p>
                  </div>
                </div>

                {/* Informações do Sistema */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Data de Criação</label>
                      <p className="text-sm text-gray-600">{formatDateTime(detalhes.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Última Atualização</label>
                      <p className="text-sm text-gray-600">{formatDateTime(detalhes.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seção de Obras Associadas */}
            {detalhes && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Obras Associadas</h3>
                
                {loadingObras ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600">Carregando obras...</span>
                  </div>
                ) : obras.length > 0 ? (
                  <div className="space-y-4">
                    {obras.map((obra) => (
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
                            {obra.status.replace('_', ' ')}
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
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL'
                                }).format(obra.orcamento_total)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Percentual Concluído:</span>
                              <span className="ml-2 text-gray-600">{obra.percentual_concluido}%</span>
                            </div>
                          </div>
                          
                          {obra.vinculo && (
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-700">Tipo Vínculo:</span>
                                <span className="ml-2 px-2 py-1 rounded text-sm bg-gray-100 text-gray-700">
                                  {obra.vinculo.tipo_vinculo}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Vínculo Início:</span>
                                <span className="ml-2 text-gray-600">{formatDate(obra.vinculo.data_inicio)}</span>
                              </div>
                              {obra.vinculo.data_fim && (
                                <div>
                                  <span className="font-medium text-gray-700">Vínculo Fim:</span>
                                  <span className="ml-2 text-gray-600">{formatDate(obra.vinculo.data_fim)}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma obra associada encontrada</p>
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

export default ViewResponsavelTecnicoButton;
