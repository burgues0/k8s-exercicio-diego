"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";

interface DeleteFiscalizacoesObraButtonProps {
  obraId: number;
  obraNome?: string;
  onSuccess?: () => void;
}

export function DeleteFiscalizacoesObraButton({
  obraId,
  obraNome,
  onSuccess,
}: DeleteFiscalizacoesObraButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await fiscalizacoesService.deleteFiscalizacoesByObra(obraId);
      
      console.log("Todas as fiscalizações da obra foram excluídas com sucesso!");
      alert("Todas as fiscalizações da obra foram excluídas com sucesso!");
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao excluir fiscalizações da obra:", error);
      
      let errorMessage = "Erro ao excluir fiscalizações da obra";
      
      // Tratamento específico baseado no status do erro
      if (error.status === 404) {
        errorMessage = "Obra não encontrada ou não possui fiscalizações";
      } else if (error.status === 403) {
        errorMessage = "Você não tem permissão para excluir fiscalizações desta obra";
      } else if (error.status === 500) {
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Fiscalizações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>todas as fiscalizações</strong> 
            {obraNome && (
              <>
                {" "}da obra <strong>"{obraNome}"</strong>
              </>
            )}
            ? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
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
            {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
