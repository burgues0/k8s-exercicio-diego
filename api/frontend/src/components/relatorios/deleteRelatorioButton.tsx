"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { relatoriosService } from "@/services/relatoriosService";
import { Relatorio } from "@/types/relatorios";
import { Trash2 } from "lucide-react";

interface DeleteRelatorioButtonProps {
  relatorio: Relatorio;
  onSuccess: () => void;
}

const DeleteRelatorioButton = ({ relatorio, onSuccess }: DeleteRelatorioButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await relatoriosService.deleteRelatorio(relatorio.id);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erro ao deletar relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="p-2 h-8 w-8 bg-red-600 hover:bg-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este relatório? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Removendo...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRelatorioButton;
