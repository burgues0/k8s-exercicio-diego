"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Equipamento, EquipamentoDetalhes } from "@/types/equipamentos";
import { equipamentosService } from "@/services/equipamentosService";
import { Eye } from "lucide-react";
import { formatDateTime, formatDate } from "@/lib/utils";

interface ViewEquipamentoButtonProps {
  equipamento: Equipamento;
}

export default function ViewEquipamentoButton({ equipamento }: ViewEquipamentoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detalhes, setDetalhes] = useState<EquipamentoDetalhes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetalhes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equipamentosService.getEquipamentoDetalhes(equipamento.id);
      setDetalhes(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar detalhes");
      setDetalhes(equipamento as EquipamentoDetalhes);
    } finally {
      setLoading(false);
    }
  }, [equipamento.id]);

  useEffect(() => {
    if (isOpen) {
      loadDetalhes();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Detalhes do Equipamento</span>
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
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-sm text-gray-600">{detalhes.nome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <p className="text-sm text-gray-600">{detalhes.tipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Marca</label>
                    <p className="text-sm text-gray-600">{detalhes.marca}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Modelo</label>
                    <p className="text-sm text-gray-600">{detalhes.modelo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Número de Série</label>
                    <p className="text-sm text-gray-600 font-mono">{detalhes.numeroDeSerie}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Estado</label>
                    <p className="text-sm text-gray-600">{detalhes.estado}</p>
                  </div>
                </div>

                {/* Informações do Fornecedor */}
                {detalhes.fornecedor && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Fornecedor</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">ID do Fornecedor</label>
                        <p className="text-sm text-gray-600">{detalhes.fornecedor.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nome</label>
                        <p className="text-sm text-gray-600">{detalhes.fornecedor.nome}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">CNPJ</label>
                        <p className="text-sm text-gray-600">{detalhes.fornecedor.cnpj}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Telefone</label>
                        <p className="text-sm text-gray-600">{detalhes.fornecedor.telefone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-gray-600">{detalhes.fornecedor.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <p className="text-sm text-gray-600">
                          {detalhes.fornecedor.ativo ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium">Endereço</label>
                      <p className="text-sm text-gray-600">{detalhes.fornecedor.endereco}</p>
                    </div>
                  </div>
                )}

                {/* Obras Associadas */}
                {detalhes.obras && detalhes.obras.length > 0 && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Obras Associadas ({detalhes.obras.length})</h3>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3 bg-gray-50">
                      {detalhes.obras.map((obra) => (
                        <div key={obra.id} className="flex items-center justify-between p-3 bg-white rounded border shadow-sm">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{obra.nome}</span>
                              <span className="text-sm text-gray-500">(ID: {obra.id})</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {obra.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {obra.percentual_concluido}% concluído
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">
                                Início: {formatDate(obra.data_inicio)}
                              </span>
                              {obra.data_conclusao && (
                                <span className="text-sm text-gray-500">
                                  Conclusão: {formatDate(obra.data_conclusao)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>Orçamento: R$ {parseFloat(obra.orcamento_total.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
}