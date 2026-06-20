"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { obrasService } from "@/services/obrasService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { Building2 } from "lucide-react";

interface Obra {
  id: number;
  nome: string;
  descricao?: string;
  status?: string;
}

interface AssignObrasFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

export default function AssignObrasFiscalizacaoButton({ fiscalizacao, onSuccess }: AssignObrasFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObras, setSelectedObras] = useState<number[]>([]);
  const [obrasDaFiscalizacao, setObrasDaFiscalizacao] = useState<Obra[]>([]);
  const [loadingObras, setLoadingObras] = useState(false);
  const [filtroObras, setFiltroObras] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadObras();
      loadObrasDaFiscalizacao();
      setFiltroObras('');
    }
  }, [isOpen]);

  const loadObras = async () => {
    try {
      const obrasData = await obrasService.getAllObras();
      setObras(obrasData);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar obras");
    }
  };

  const loadObrasDaFiscalizacao = async () => {
    try {
      setLoadingObras(true);
      setError(null);
      // Busca os detalhes da fiscalização que inclui as obras associadas
      const detalhes = await fiscalizacoesService.getFiscalizacaoDetalhes(fiscalizacao.id);
      const obrasAssociadas = detalhes.obras || [];
      setObrasDaFiscalizacao(obrasAssociadas);
      setSelectedObras(obrasAssociadas.map(obra => obra.id));
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar obras da fiscalização");
      setObrasDaFiscalizacao([]);
      setSelectedObras([]);
    } finally {
      setLoadingObras(false);
    }
  };

  // Filtra obras que não estão associadas à fiscalização
  const obrasDisponiveis = useMemo(() => {
    const obrasNaoAssociadas = obras.filter(obra => 
      !obrasDaFiscalizacao.some(obraAssociada => obraAssociada.id === obra.id)
    );

    if (!filtroObras.trim()) {
      return obrasNaoAssociadas;
    }

    return obrasNaoAssociadas.filter(obra => 
      obra.nome.toLowerCase().includes(filtroObras.toLowerCase()) ||
      obra.id.toString().includes(filtroObras) ||
      (obra.descricao && obra.descricao.toLowerCase().includes(filtroObras.toLowerCase()))
    );
  }, [obras, obrasDaFiscalizacao, filtroObras]);

  const handleToggleObra = (obraId: number) => {
    setSelectedObras(prev => 
      prev.includes(obraId) 
        ? prev.filter(id => id !== obraId)
        : [...prev, obraId]
    );
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Atualiza as obras associadas à fiscalização usando o mesmo padrão dos equipamentos
      await fiscalizacoesService.updateFiscalizacao(fiscalizacao.id, { obraIds: selectedObras });
      
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao salvar associações");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    const obrasOriginais = obrasDaFiscalizacao.map(obra => obra.id);
    return JSON.stringify(selectedObras.sort()) !== JSON.stringify(obrasOriginais.sort());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>Obras</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white flex flex-col">
        <DialogHeader className="text-white p-4 bg-[#F1860C] rounded-t-lg flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Gerenciar Obras da Fiscalização</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* Seção das obras já associadas */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div>
            <h3 className="text-lg font-semibold mb-2">Obras Associadas</h3>
            {loadingObras ? (
              <p className="text-blue-500 text-sm">Carregando obras associadas...</p>
            ) : obrasDaFiscalizacao.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-white">
                {obrasDaFiscalizacao.map((obra) => (
                  <div key={obra.id} className="flex items-center justify-between p-2 bg-white border rounded">
                    <div>
                      <span className="font-medium">{obra.nome}</span>
                      <span className="text-sm text-gray-500 ml-2">(ID: {obra.id})</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedObras.includes(obra.id)}
                      onChange={() => handleToggleObra(obra.id)}
                      className="h-4 w-4"
                      title="Desmarque para remover da fiscalização"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma obra associada</p>
            )}
          </div>

          {/* Seção para adicionar novas obras */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Adicionar Obras</h3>
            
            {/* Campo de filtro para pesquisar obras */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Buscar obra por nome ou ID..."
                value={filtroObras}
                onChange={(e) => {
                  setFiltroObras(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 bg-white"
              />
              <p className="text-sm text-gray-500 mt-1">Digite para filtrar as obras disponíveis</p>
            </div>

            {/* Lista de obras disponíveis */}
            <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white">
              {obrasDisponiveis.length > 0 ? (
                obrasDisponiveis.map((obra) => (
                  <div key={obra.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedObras.includes(obra.id)}
                        onChange={() => handleToggleObra(obra.id)}
                        className="h-4 w-4 mr-3"
                        title="Marque para associar à fiscalização"
                      />
                      <div>
                        <span className="font-medium">{obra.nome}</span>
                        <span className="text-sm text-gray-500 ml-2">(ID: {obra.id})</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm p-2">
                  {filtroObras 
                    ? "Nenhuma obra encontrada com esse filtro" 
                    : "Todas as obras disponíveis já estão associadas"
                  }
                </p>
              )}
            </div>
          </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <DialogFooter className="p-4 border-t bg-white flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !hasChanges()}
            style={{ backgroundColor: '#F1860C' }}
            className="text-white hover:bg-orange-600"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
