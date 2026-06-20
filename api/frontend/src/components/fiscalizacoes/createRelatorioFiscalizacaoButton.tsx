"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { CreateRelatorioDto } from "@/types/relatorios";
import { Plus } from "lucide-react";

interface CreateRelatorioFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

export default function CreateRelatorioFiscalizacaoButton({ fiscalizacao, onSuccess }: CreateRelatorioFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateRelatorioDto>({
    titulo: '',
    conteudo: '',
    dataCriacao: new Date().toISOString().split('T')[0],
    fiscalizacaoId: Number(fiscalizacao.id) // Garantindo que seja um número
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Remove a mensagem de erro quando o usuário começa a digitar
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError('O título é obrigatório');
      return false;
    }

    if (formData.titulo.trim().length < 3) {
      setError('O título deve ter pelo menos 3 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fiscalizacoesService.createRelatorioFiscalizacao(fiscalizacao.id, {
        titulo: formData.titulo.trim(),
        conteudo: formData.conteudo.trim(),
        dataCriacao: formData.dataCriacao,
        fiscalizacaoId: Number(fiscalizacao.id) // Garantindo que seja um número inteiro
      });
      
      setIsOpen(false);
      setFormData({ 
        titulo: '', 
        conteudo: '', 
        dataCriacao: new Date().toISOString().split('T')[0],
        fiscalizacaoId: Number(fiscalizacao.id)
      });
      onSuccess();
    } catch (err: unknown) {
      let errorMessage = "Erro ao criar relatório";
      
      if (err && typeof err === 'object') {
        if ('message' in err && err.message && typeof err.message === 'string') {
          errorMessage = err.message;
        }
        else if ('data' in err && err.data && typeof err.data === 'object') {
          const data = err.data as { message?: string; error?: string };
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFormData({ 
        titulo: '', 
        conteudo: '', 
        dataCriacao: new Date().toISOString().split('T')[0],
        fiscalizacaoId: Number(fiscalizacao.id)
      });
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-start gap-2 p-3 h-auto">
          <Plus className="w-4 h-4" />
          <span>Criar Relatório</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">
            Criar Novo Relatório
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-slate-700 font-medium">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título do relatório..."
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataCriacao" className="text-slate-700 font-medium">
                  Data do Relatório *
                </Label>
                <Input
                  id="dataCriacao"
                  type="date"
                  value={formData.dataCriacao}
                  onChange={(e) => handleInputChange('dataCriacao', e.target.value)}
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo" className="text-slate-700 font-medium">
                  Conteúdo do Relatório
                </Label>
                <textarea
                  id="conteudo"
                  placeholder="Digite o conteúdo do relatório... (opcional)"
                  value={formData.conteudo}
                  onChange={(e) => handleInputChange('conteudo', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1860C]/20 focus:border-[#F1860C] resize-vertical min-h-[100px] bg-white"
                  rows={4}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200">
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
                disabled={isLoading}
                className="text-white font-semibold px-8 shadow-lg"
                style={{ backgroundColor: '#F1860C' }}
              >
                {isLoading ? "Criando..." : "Criar Relatório"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
