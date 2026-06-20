"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { relatoriosService } from "@/services/relatoriosService";
import { CreateRelatorioDto } from "@/types/relatorios";
import { Plus } from "lucide-react";

interface CreateRelatorioButtonProps {
  onSuccess: () => void;
}

const CreateRelatorioButton = ({ onSuccess }: CreateRelatorioButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateRelatorioDto>({
    titulo: '',
    fiscalizacaoId: undefined,
    conteudo: ''
  });

  const handleInputChange = (field: keyof CreateRelatorioDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      fiscalizacaoId: undefined,
      conteudo: ''
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      setError('O título é obrigatório.');
      return;
    }
    
    if (!formData.fiscalizacaoId || formData.fiscalizacaoId <= 0) {
      setError('O ID da fiscalização deve ser um número válido.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await relatoriosService.createRelatorio(formData);
      setIsOpen(false);
      resetForm();
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erro ao criar relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Criar Novo Relatório</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-slate-700 font-medium">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Digite o título do relatório"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalizacaoId" className="text-slate-700 font-medium">ID da Fiscalização *</Label>
                <Input
                  id="fiscalizacaoId"
                  type="number"
                  value={formData.fiscalizacaoId || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleInputChange('fiscalizacaoId', value ? parseInt(value) : undefined);
                  }}
                  placeholder="Digite o ID da fiscalização"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo" className="text-slate-700 font-medium">Conteúdo</Label>
                <textarea
                  id="conteudo"
                  value={formData.conteudo}
                  onChange={(e) => handleInputChange('conteudo', e.target.value)}
                  placeholder="Digite o conteúdo do relatório"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1860C]/20 focus:border-[#F1860C] resize-vertical min-h-[100px] bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-800 font-medium">Erro ao criar relatório</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
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
                {isLoading ? 'Criando...' : 'Criar Relatório'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRelatorioButton;
