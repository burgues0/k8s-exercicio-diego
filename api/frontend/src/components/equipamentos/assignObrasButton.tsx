"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { equipamentosService } from "@/services/equipamentosService";
import { obrasService } from "@/services/obrasService";
import { Equipamento, Obra } from "@/types/equipamentos";
import { Building2 } from "lucide-react";

interface AssignObrasButtonProps {
  equipamento: Equipamento;
  onSuccess: () => void;
}

export default function AssignObrasButton({ equipamento, onSuccess }: AssignObrasButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObras, setSelectedObras] = useState<number[]>([]);
  const [obrasDoEquipamento, setObrasDoEquipamento] = useState<Obra[]>([]);
  const [loadingObras, setLoadingObras] = useState(false);
  const [filtroObras, setFiltroObras] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadObras();
      loadObrasDoEquipamento();
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

  const loadObrasDoEquipamento = async () => {
    try {
      setLoadingObras(true);
      setError(null);
      const obrasDoEquipamentoData = await equipamentosService.getObrasByEquipamentoId(equipamento.id);
      setObrasDoEquipamento(obrasDoEquipamentoData || []);
      setSelectedObras((obrasDoEquipamentoData || []).map(obra => obra.id));
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erro ao carregar obras do equipamento:", error.message);
      setError(`Erro ao carregar obras: ${error.message}`);
      setObrasDoEquipamento([]);
      setSelectedObras([]);
    } finally {
      setLoadingObras(false);
    }
  };

  const obrasDisponiveis = useMemo(() => {
    const obrasNaoAssociadas = obras.filter(obra => 
      !obrasDoEquipamento.some(obraAssociada => obraAssociada.id === obra.id)
    );

    if (!filtroObras.trim()) {
      return obrasNaoAssociadas;
    }

    const filtroLowerCase = filtroObras.toLowerCase().trim();
    return obrasNaoAssociadas.filter(obra => 
      obra.nome.toLowerCase().includes(filtroLowerCase) ||
      obra.id.toString().includes(filtroLowerCase)
    );
  }, [obras, obrasDoEquipamento, filtroObras]);

  const handleToggleObra = (obraId: number) => {
    setSelectedObras(prev => 
      prev.includes(obraId) 
        ? prev.filter(id => id !== obraId)
        : [...prev, obraId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!equipamento || !equipamento.id || equipamento.id === 0) {
        throw new Error("ID do equipamento inválido. Não é possível atualizar as obras.");
      }

      if (!selectedObras || selectedObras.length === 0) {
        throw new Error("Pelo menos uma obra deve ser selecionada para atualizar.");
      }

      await equipamentosService.updateEquipamento(equipamento.id, { obrasId: selectedObras });
      
      onSuccess();
      setIsOpen(false);
      setFiltroObras('');
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erro detalhado ao atualizar obras do equipamento:", error);
      const errorMessage = error.message || "Erro ao atualizar obras do equipamento";
      
      if (errorMessage.includes("WHERE parameter \"id\" has invalid \"undefined\" value")) {
        setError("Erro interno: ID do equipamento inválido. Recarregue a página e tente novamente.");
      } else if (errorMessage.includes("ID do equipamento inválido")) {
        setError("Erro: O equipamento selecionado não possui um ID válido.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 h-8">
          <Building2 className="h-4 w-4" />
          Obras
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Gerenciar Obras do Equipamento</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          {/* Seção das obras já associadas */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div>
            <h3 className="text-lg font-semibold mb-2">Obras Associadas</h3>
            {error && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            {loadingObras ? (
              <p className="text-blue-500 text-sm">Carregando obras associadas...</p>
            ) : obrasDoEquipamento.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {obrasDoEquipamento.map((obra) => (
                  <div key={obra.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{obra.nome}</span>
                      <span className="text-sm text-gray-500 ml-2">(ID: {obra.id})</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedObras.includes(obra.id)}
                      onChange={() => handleToggleObra(obra.id)}
                      className="h-4 w-4"
                      title="Desmarque para remover da obra"
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
                className="w-full border border-gray-300 px-3 py-2 rounded"
                style={{ backgroundColor: '#f9f9f9' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite para filtrar as obras disponíveis
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
              {obrasDisponiveis.map((obra) => (
                <div key={obra.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`obra-${obra.id}`}
                    checked={selectedObras.includes(obra.id)}
                    onChange={() => handleToggleObra(obra.id)}
                    className="h-4 w-4"
                  />
                  <label 
                    htmlFor={`obra-${obra.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {obra.nome} (ID: {obra.id})
                  </label>
                </div>
              ))}
              {obrasDisponiveis.length === 0 && obras.length > 0 && (
                <p className="text-gray-500 text-sm">
                  {filtroObras.trim() 
                    ? `Nenhuma obra encontrada para "${filtroObras}"`
                    : "Todas as obras disponíveis já estão associadas"
                  }
                </p>
              )}
              {obras.length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma obra disponível</p>
              )}
            </div>
          </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200 p-6">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}
              className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}
              className="text-white font-semibold px-8 shadow-lg"
              style={{ backgroundColor: '#F1860C' }}>
              {isLoading ? "Atualizando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
