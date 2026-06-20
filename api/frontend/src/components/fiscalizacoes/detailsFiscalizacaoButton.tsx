"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao, FiscalizacaoDetalhes } from "@/types/fiscalizacoes";
import { Info, Loader2 } from "lucide-react";

const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'Não disponível';
  }
  
  try {
    const dateOnly = dateString.split('T')[0];
    const date = new Date(dateOnly + 'T00:00:00');
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

interface DetailsFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
}

export default function DetailsFiscalizacaoButton({ fiscalizacao }: DetailsFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detalhes, setDetalhes] = useState<FiscalizacaoDetalhes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetalhes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fiscalizacoesService.getFiscalizacaoDetalhes(fiscalizacao.id);
      setDetalhes(data);
    } catch (err: unknown) {
      setError('Erro ao carregar detalhes da fiscalização');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadDetalhes();
    } else {
      setDetalhes(null);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>Detalhes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Info className="w-5 h-5" />
            Detalhes Completos da Fiscalização #{fiscalizacao.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-gray-600">Carregando detalhes...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {detalhes && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Informações Principais */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <p className="text-lg font-semibold text-gray-800">{detalhes.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-lg font-semibold text-blue-600">{detalhes.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsável ID</label>
                    <p className="text-lg font-semibold text-gray-800">{detalhes.responsavelTecnicoId}</p>
                  </div>
                </div>

                {/* Título e Descrição */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-500">Título</label>
                  <p className="text-xl font-bold text-gray-800 mt-1">{detalhes.titulo}</p>
                </div>

                {detalhes.descricao && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500">Descrição</label>
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap bg-gray-50 p-4 rounded border">{detalhes.descricao}</p>
                  </div>
                )}

                {/* Datas */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Início</label>
                    <p className="text-lg text-gray-800">{formatDate(detalhes.data_inicio)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Fim</label>
                    <p className="text-lg text-gray-800">{formatDate(detalhes.data_fim)}</p>
                  </div>
                </div>

                {/* Responsável Técnico */}
                {detalhes.responsavel && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">👤 Responsável Técnico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-blue-600">Nome</label>
                        <p className="text-blue-900 font-medium">{detalhes.responsavel.nome}</p>
                      </div>
                      {detalhes.responsavel.email && (
                        <div>
                          <label className="text-sm font-medium text-blue-600">Email</label>
                          <p className="text-blue-900">{detalhes.responsavel.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Obra */}
                {detalhes.obra && (
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">🏗️ Obra Relacionada</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-green-600">Nome da Obra</label>
                        <p className="text-green-900 font-medium">{detalhes.obra.nome}</p>
                      </div>
                      {detalhes.obra.localizacao && (
                        <div>
                          <label className="text-sm font-medium text-green-600">Localização</label>
                          <p className="text-green-900">{detalhes.obra.localizacao}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Relatórios */}
                {detalhes.relatorios && detalhes.relatorios.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                      📋 Relatórios ({detalhes.relatorios.length})
                    </h3>
                    <div className="space-y-3">
                      {detalhes.relatorios.map((relatorio) => (
                        <div key={relatorio.id} className="bg-white border border-yellow-200 rounded p-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium text-yellow-600">ID</label>
                              <p className="text-sm font-semibold text-yellow-900">{relatorio.id}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-yellow-600">Título</label>
                              <p className="text-sm text-yellow-900">{relatorio.titulo}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-yellow-600">Data de Criação</label>
                              <p className="text-sm text-yellow-900">{formatDate(relatorio.data_criacao)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações do Sistema */}
                {(detalhes.createdAt || detalhes.updatedAt) && (
                  <div className="bg-gray-50 rounded-lg p-4 border-t-2 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Informações do Sistema</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {detalhes.createdAt && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Criado em</label>
                          <p className="text-sm text-gray-700">{formatDate(detalhes.createdAt)}</p>
                        </div>
                      )}
                      {detalhes.updatedAt && (
                        <div>
                          <label className="text-xs font-medium text-gray-500">Última atualização</label>
                          <p className="text-sm text-gray-700">{formatDate(detalhes.updatedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
