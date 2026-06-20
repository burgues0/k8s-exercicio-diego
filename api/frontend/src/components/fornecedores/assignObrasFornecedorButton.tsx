"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fornecedoresService } from "@/services/fornecedoresService";
import { obrasService } from "@/services/obrasService";
import { Fornecedor, Obra } from "@/types/fornecedores";
import { Building2 } from "lucide-react";

interface AssignObrasFornecedorButtonProps {
  fornecedor: Fornecedor;
  onSuccess: () => void;
}

export default function AssignObrasFornecedorButton({ fornecedor, onSuccess }: AssignObrasFornecedorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObras, setSelectedObras] = useState<number[]>([]);
  const [filtroObras, setFiltroObras] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadObras();
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

  const obrasDisponiveis = useMemo(() => {
    if (!filtroObras.trim()) {
      return obras;
    }

    const filtroLowerCase = filtroObras.toLowerCase().trim();
    return obras.filter(obra => 
      obra.nome.toLowerCase().includes(filtroLowerCase) ||
      obra.id.toString().includes(filtroLowerCase)
    );
  }, [obras, filtroObras]);

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
      if (!fornecedor || !fornecedor.id || fornecedor.id === 0) {
        throw new Error("ID do fornecedor inválido. Não é possível atualizar as obras.");
      }

      if (!selectedObras || selectedObras.length === 0) {
        throw new Error("Pelo menos uma obra deve ser selecionada para atualizar.");
      }

      await fornecedoresService.updateFornecedor(fornecedor.id, { obrasId: selectedObras });
      
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao atualizar obras do fornecedor");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
          <Building2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Gerenciar Obras do Fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div>
            <h3 className="text-lg font-semibold mb-2">Associar Obras ao Fornecedor</h3>
            {error && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <Input
                placeholder="Filtrar obras por nome ou ID..."
                value={filtroObras}
                onChange={(e) => setFiltroObras(e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
              />
            </div>

            {obrasDisponiveis.length === 0 ? (
              <p className="text-slate-500 text-sm py-2">
                {filtroObras ? 'Nenhuma obra encontrada com este filtro' : 'Todas as obras disponíveis já estão associadas'}
              </p>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {obrasDisponiveis.map(obra => (
                    <div key={obra.id} className="flex items-center space-x-3 bg-white p-3 rounded border">
                      <input
                        type="checkbox"
                        id={`obra-${obra.id}`}
                        checked={selectedObras.includes(obra.id)}
                        onChange={() => handleToggleObra(obra.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor={`obra-${obra.id}`} className="flex-1 cursor-pointer text-sm">
                        <span className="font-medium">#{obra.id} - {obra.nome}</span>
                        <div className="text-xs text-slate-500">Status: {obra.status}</div>
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedObras.length > 0 && (
                  <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-orange-800 text-sm font-medium">
                      {selectedObras.length} obra(s) selecionada(s) para associação
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-white border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Fechar
          </Button>
          {selectedObras.length > 0 && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#F1860C] hover:bg-[#e07a0b] text-white"
            >
              {isLoading ? "Associando..." : `Associar ${selectedObras.length} Obra(s)`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
