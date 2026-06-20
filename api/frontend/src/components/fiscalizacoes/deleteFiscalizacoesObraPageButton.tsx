"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Search, Trash2 } from "lucide-react";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { obrasService } from "@/services/obrasService";

interface DeleteFiscalizacoesObraPageButtonProps {
  onSuccess?: () => void;
}

export function DeleteFiscalizacoesObraPageButton({
  onSuccess,
}: DeleteFiscalizacoesObraPageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchObraId, setSearchObraId] = useState("");
  const [obraEncontrada, setObraEncontrada] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchObra = async () => {
    if (!searchObraId || isNaN(Number(searchObraId))) {
      alert("Por favor, digite um ID de obra válido");
      return;
    }

    try {
      setIsSearching(true);
      const obra = await obrasService.getObraById(Number(searchObraId));
      setObraEncontrada(obra);
    } catch (error: any) {
      console.error("Erro ao buscar obra:", error);
      alert("Obra não encontrada");
      setObraEncontrada(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!obraEncontrada) return;

    try {
      setIsLoading(true);
      await fiscalizacoesService.deleteFiscalizacoesByObra(obraEncontrada.id);
      
      console.log("Todas as fiscalizações da obra foram excluídas com sucesso!");
      alert("Todas as fiscalizações da obra foram excluídas com sucesso!");
      setIsOpen(false);
      setObraEncontrada(null);
      setSearchObraId("");
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

  const resetModal = () => {
    setObraEncontrada(null);
    setSearchObraId("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={resetModal}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir Fiscalizações por Obra
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Excluir Fiscalizações por Obra
          </DialogTitle>
          <DialogDescription>
            Busque uma obra pelo ID para excluir todas as suas fiscalizações.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="obraId">ID da Obra</Label>
            <div className="flex gap-2">
              <Input
                id="obraId"
                placeholder="Digite o ID da obra..."
                value={searchObraId}
                onChange={(e) => setSearchObraId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchObra()}
              />
              <Button
                onClick={handleSearchObra}
                disabled={isSearching || !searchObraId}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isSearching && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Buscando obra...</p>
            </div>
          )}

          {obraEncontrada && (
            <div className="border rounded p-3 bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Obra Encontrada:</h4>
              <div className="text-sm text-blue-800">
                <div><strong>ID:</strong> {obraEncontrada.id}</div>
                <div><strong>Nome:</strong> {obraEncontrada.nome}</div>
                {obraEncontrada.descricao && (
                  <div><strong>Descrição:</strong> {obraEncontrada.descricao}</div>
                )}
              </div>
              
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium text-sm">Atenção!</p>
                    <p className="text-red-700 text-sm">
                      Esta ação excluirá <strong>todas as fiscalizações</strong> associadas a esta obra 
                      e não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          {obraEncontrada && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Confirmar Exclusão"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
