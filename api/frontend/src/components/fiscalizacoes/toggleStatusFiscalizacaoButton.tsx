"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { Badge } from "@/components/ui/badge";

interface ToggleStatusFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

export default function ToggleStatusFiscalizacaoButton({ fiscalizacao, onSuccess }: ToggleStatusFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoStatus, setNovoStatus] = useState(fiscalizacao.status);

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'planejada': { label: 'Planejada', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'em_andamento': { label: 'Em Andamento', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'concluida': { label: 'Concluída', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <Badge className={`border ${statusInfo.className}`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await fiscalizacoesService.updateFiscalizacaoStatus(fiscalizacao.id, novoStatus);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      let errorMessage = error.message || "Erro ao alterar status da fiscalização";
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
      setNovoStatus(fiscalizacao.status);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <span>Status</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Alterar Status</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Fiscalização</Label>
                <p className="text-slate-900 font-medium">{fiscalizacao.titulo}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Status Atual</Label>
                <div className="mt-1">
                  {getStatusBadge(fiscalizacao.status)}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="novoStatus" className="text-sm font-medium text-slate-700">
                  Novo Status
                </Label>
                <Select value={novoStatus} onValueChange={setNovoStatus}>
                  <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white">
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejada">Planejada</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading || novoStatus === fiscalizacao.status}
                className="bg-[#F1860C] hover:bg-[#d6730a] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Alterando...
                  </div>
                ) : (
                  'Alterar Status'
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-4">
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
