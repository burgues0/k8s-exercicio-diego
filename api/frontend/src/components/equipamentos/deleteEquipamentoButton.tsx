"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { equipamentosService } from "@/services/equipamentosService";
import { Trash2 } from "lucide-react";

interface DeleteEquipamentoButtonProps {
  equipamentoId: number;
  onSuccess: () => void;
}

export default function DeleteEquipamentoButton({ equipamentoId, onSuccess }: DeleteEquipamentoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await equipamentosService.deleteEquipamento(equipamentoId);
      onSuccess();
      setIsOpen(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao excluir equipamento");
    } finally {
      setIsLoading(false);
    }
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
            Tem certeza que deseja remover este equipamento? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Removendo..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
