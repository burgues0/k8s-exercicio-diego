"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";

interface DeleteRelatoriosFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

export default function DeleteRelatoriosFiscalizacaoButton({ fiscalizacao, onSuccess }: DeleteRelatoriosFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fiscalizacoesService.deleteRelatoriosFiscalizacao(fiscalizacao.id);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao excluir relatórios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-start gap-2 p-3 h-auto">
          <Trash2 className="w-4 h-4" />
          <span>Excluir Relatórios</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white shadow-2xl" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Confirmar Exclusão</DialogTitle>
          <DialogDescription className="text-gray-600">
            Tem certeza que deseja excluir todos os relatórios desta fiscalização?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Excluindo..." : "Excluir Relatórios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
