"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";
import { ResponsavelTecnico } from "@/types/responsaveis-tecnicos";
import { Trash2 } from "lucide-react";

interface DeleteResponsavelTecnicoButtonProps {
  responsavel: ResponsavelTecnico;
  onSuccess: () => void;
}

const DeleteResponsavelTecnicoButton = ({ responsavel, onSuccess }: DeleteResponsavelTecnicoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await responsaveisTecnicosService.deleteResponsavelTecnico(responsavel.id);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      let errorMessage = error.message || 'Erro ao deletar responsável técnico.';
      
      // Verifica se é erro de chave estrangeira
      if (errorMessage.includes('foreign key constraint') || 
          errorMessage.includes('fiscalizacoes_responsavelTecnicoId_fkey') ||
          errorMessage.includes('violates foreign key')) {
        errorMessage = 'Não é possível excluir este responsável técnico pois existem fiscalizações associadas a ele. Remova ou transfira as fiscalizações primeiro.';
      } else if (errorMessage.includes('Internal server error')) {
        errorMessage = 'Erro interno do servidor. Verifique se existem registros dependentes associados a este responsável técnico.';
      }
      
      setError(errorMessage);
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
            Tem certeza que deseja remover o responsável técnico &quot;{responsavel.nome}&quot;? 
            <br />
            <strong>Atenção:</strong> Esta ação não pode ser desfeita e só será possível se não houver fiscalizações ou outros registros associados.
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

export default DeleteResponsavelTecnicoButton;
