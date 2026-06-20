"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao, UpdateFiscalizacaoDto } from "@/types/fiscalizacoes";
import { Edit } from "lucide-react";

interface EditFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

const EditFiscalizacaoButton = ({ fiscalizacao, onSuccess }: EditFiscalizacaoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateFiscalizacaoDto>({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    responsavelTecnicoId: undefined
  });

  // Inicializa o formulário quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setFormData({
        titulo: '',
        descricao: '',
        data_inicio: '',
        data_fim: '',
        responsavelTecnicoId: undefined
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof UpdateFiscalizacaoDto, value: string | number | undefined) => {
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
    // Verifica se pelo menos um campo foi preenchido
    const hasData = 
      (formData.titulo && formData.titulo.trim().length > 0) ||
      (formData.descricao && formData.descricao.trim().length > 0) ||
      (formData.data_inicio && formData.data_inicio.length > 0) ||
      (formData.data_fim && formData.data_fim.length > 0) ||
      formData.responsavelTecnicoId;

    if (!hasData) {
      setError('Pelo menos um campo deve ser preenchido para atualizar a fiscalização');
      return false;
    }

    // Validações básicas
    if (formData.titulo && formData.titulo.trim().length < 3) {
      setError('O título deve ter pelo menos 3 caracteres');
      return false;
    }

    if (formData.data_inicio && formData.data_fim) {
      const dataInicio = new Date(formData.data_inicio);
      const dataFim = new Date(formData.data_fim);
      
      if (dataInicio > dataFim) {
        setError('A data de início não pode ser posterior à data de fim');
        return false;
      }
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
      // Envia apenas campos preenchidos
      const updatePayload: UpdateFiscalizacaoDto = {};
      
      if (formData.titulo && formData.titulo.trim()) {
        updatePayload.titulo = formData.titulo.trim();
      }
      if (formData.descricao && formData.descricao.trim()) {
        updatePayload.descricao = formData.descricao.trim();
      }
      if (formData.data_inicio) {
        updatePayload.data_inicio = formData.data_inicio;
      }
      if (formData.data_fim) {
        updatePayload.data_fim = formData.data_fim;
      }
      if (formData.responsavelTecnicoId) {
        updatePayload.responsavelTecnicoId = formData.responsavelTecnicoId;
      }

      await fiscalizacoesService.updateFiscalizacao(fiscalizacao.id, updatePayload);
      
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error & {
        status?: number;
        statusText?: string;
        data?: any;
      };
      
      let errorMessage = error.message || "Erro ao atualizar fiscalização";
      
      // Se há dados do erro do backend, tenta extrair informações mais específicas
      if (error.data) {
        const backendMessage = error.data.message || 
                              error.data.error || 
                              error.data.msg || 
                              error.data.detail || 
                              error.data.description ||
                              error.data.mensagem;
        
        if (backendMessage) {
          errorMessage = backendMessage;
        }
        
        // Se há erros de validação específicos
        if (error.data.errors && Array.isArray(error.data.errors)) {
          errorMessage = error.data.errors.join(', ');
        } else if (error.data.errors && typeof error.data.errors === 'object') {
          const validationErrors = Object.values(error.data.errors).flat();
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join(', ');
          }
        }
      }
      
      // Adiciona informações do status HTTP se disponível
      if (error.status) {
        errorMessage = `[${error.status}] ${errorMessage}`;
      }
      
      setError(errorMessage);
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
        >
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">
            Editar Fiscalização
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">

          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="titulo"
              placeholder="Digite o título da fiscalização..."
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </Label>
            <Input
              id="descricao"
              placeholder="Digite a descrição da fiscalização..."
              value={formData.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio" className="text-sm font-medium">
                Data de Início
              </Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim" className="text-sm font-medium">
                Data de Fim
              </Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => handleInputChange('data_fim', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavelTecnicoId" className="text-sm font-medium">
              ID do Responsável
            </Label>
            <Input
              id="responsavelTecnicoId"
              type="number"
              placeholder="Digite o ID do responsável..."
              value={formData.responsavelTecnicoId || ''}
              onChange={(e) => handleInputChange('responsavelTecnicoId', e.target.value ? parseInt(e.target.value) : undefined)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mx-6 mb-4">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <DialogFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 text-white font-semibold"
              style={{ background: '#F1860C' }}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFiscalizacaoButton;
