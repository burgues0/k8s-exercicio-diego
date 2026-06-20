"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { fornecedoresService } from "@/services/fornecedoresService";
import { Fornecedor } from "@/types/fornecedores";
import { Badge } from "@/components/ui/badge";

interface ToggleStatusFornecedorButtonProps {
  fornecedor: Fornecedor;
  onSuccess: () => void;
}

export default function ToggleStatusFornecedorButton({ fornecedor, onSuccess }: ToggleStatusFornecedorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoStatus, setNovoStatus] = useState(fornecedor.ativo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await fornecedoresService.updateFornecedor(fornecedor.id, { ativo: novoStatus });
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      let errorMessage = error.message || "Erro ao alterar status do fornecedor";
      if (errorMessage.startsWith("Erro ao alterar status:")) {
        errorMessage = errorMessage.replace("Erro ao alterar status:", "").trim();
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setNovoStatus(fornecedor.ativo);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Alterar Status</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-800 font-medium">Erro</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Fornecedor</Label>
                <p className="text-slate-900 font-medium">{fornecedor.nome}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Status Atual</Label>
                <div className="mt-1">
                  <Badge 
                    variant={fornecedor.ativo ? "default" : "default"}
                    className={fornecedor.ativo ? "bg-white text-black border border-gray-300 hover:bg-gray-50" : ""}
                  >
                    {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Novo Status</Label>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="status"
                    checked={novoStatus}
                    onCheckedChange={setNovoStatus}
                  />
                  <Label htmlFor="status" className="text-slate-700">
                    {novoStatus ? 'Ativo' : 'Inativo'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || novoStatus === fornecedor.ativo}
                className="bg-[#F1860C] hover:bg-[#e07a0b] text-white"
              >
                {isLoading ? "Alterando..." : "Alterar Status"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
