"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { relatoriosService } from "@/services/relatoriosService";
import { Relatorio } from "@/types/relatorios";
import { Edit } from "lucide-react";

interface EditRelatorioButtonProps {
  relatorio: Relatorio;
  onSuccess: () => void;
}

const EditRelatorioButton = ({ relatorio, onSuccess }: EditRelatorioButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: ''
  });

  // Inicializa o formulário quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titulo: relatorio.titulo || '',
        conteudo: relatorio.conteudo || ''
      });
      setError(null);
    }
  }, [isOpen, relatorio]);

  const handleInputChange = (field: string, value: string) => {
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updateData = {
        titulo: formData.titulo.trim(),
        conteudo: formData.conteudo.trim()
      };

      await relatoriosService.updateRelatorio(relatorio.id, updateData);
      
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erro ao atualizar relatório');
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
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">
            Editar Relatório
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-sm font-medium">
                Título *
              </Label>
              <Input
                id="titulo"
                placeholder="Digite o título do relatório..."
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo" className="text-sm font-medium">
                Conteúdo
              </Label>
              <textarea
                id="conteudo"
                placeholder="Digite o conteúdo do relatório..."
                value={formData.conteudo}
                onChange={(e) => handleInputChange('conteudo', e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border border-slate-300 rounded-md focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white resize-vertical"
                rows={5}
              />
            </div>

          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mx-6 mb-4">
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

          <DialogFooter className="flex justify-end gap-3 p-6 pt-0 bg-gradient-to-br from-gray-50 to-gray-100">
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
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#F1860C] hover:bg-[#d6730a] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Atualizando...
                </div>
              ) : (
                'Atualizar Relatório'
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRelatorioButton;
