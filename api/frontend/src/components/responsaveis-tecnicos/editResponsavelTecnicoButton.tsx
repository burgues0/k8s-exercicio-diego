"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";
import { ResponsavelTecnico, UpdateResponsavelTecnicoDto } from "@/types/responsaveis-tecnicos";
import { Edit } from "lucide-react";

interface EditResponsavelTecnicoButtonProps {
  responsavel: ResponsavelTecnico;
  onSuccess: () => void;
}

// Função para formatar CPF
const formatCPF = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);
  
  // Aplica a formatação xxx.xxx.xxx-xx
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
};

// Função para validar CPF
const isValidCPF = (cpf: string): boolean => {
  if (!cpf) return true; // CPF vazio é válido para edição (campo opcional)
  
  // Remove formatação
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 > 9) digit1 = 0;
  
  if (parseInt(numbers[9]) !== digit1) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 > 9) digit2 = 0;
  
  return parseInt(numbers[10]) === digit2;
};

const EditResponsavelTecnicoButton = ({ responsavel, onSuccess }: EditResponsavelTecnicoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateResponsavelTecnicoDto>({
    nome: '',
    cpf: '',
    registro_profissional: '',
    especialidade: '',
    ativo: undefined
  });

  // Inicializa o formulário quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nome: '',
        cpf: '',
        registro_profissional: '',
        especialidade: '',
        ativo: undefined
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof UpdateResponsavelTecnicoDto, value: string | boolean | undefined) => {
    let processedValue = value;
    
    // Aplica formatação especial para CPF
    if (field === 'cpf' && typeof value === 'string') {
      processedValue = formatCPF(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Remove a mensagem de erro quando o usuário começa a digitar
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    // Verifica se pelo menos um campo foi preenchido
    const hasData = 
      (formData.nome && formData.nome.trim().length > 0) ||
      (formData.cpf && formData.cpf.trim().length > 0) ||
      (formData.registro_profissional && formData.registro_profissional.trim().length > 0) ||
      (formData.especialidade && formData.especialidade.trim().length > 0) ||
      formData.ativo !== undefined;

    if (!hasData) {
      setError('Pelo menos um campo deve ser preenchido para atualizar o responsável técnico');
      return false;
    }

    // Validações básicas
    if (formData.nome && formData.nome.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    // Validação do CPF se preenchido
    if (formData.cpf && formData.cpf.trim() && !isValidCPF(formData.cpf)) {
      setError('CPF inválido. Verifique os números digitados');
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
      // Envia apenas campos preenchidos
      const updatePayload: UpdateResponsavelTecnicoDto = {};
      
      if (formData.nome && formData.nome.trim()) {
        updatePayload.nome = formData.nome.trim();
      }
      if (formData.cpf && formData.cpf.trim()) {
        updatePayload.cpf = formData.cpf; // Envia CPF formatado (xxx.xxx.xxx-xx)
      }
      if (formData.registro_profissional && formData.registro_profissional.trim()) {
        updatePayload.registro_profissional = formData.registro_profissional.trim();
      }
      if (formData.especialidade && formData.especialidade.trim()) {
        updatePayload.especialidade = formData.especialidade.trim();
      }
      if (formData.ativo !== undefined) {
        updatePayload.ativo = formData.ativo;
      }

      await responsaveisTecnicosService.updateResponsavelTecnico(responsavel.id, updatePayload);
      
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao atualizar responsável técnico");
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
            Editar Responsável Técnico
          </DialogTitle>
          <DialogDescription className="text-orange-100 mt-1">
            Atualize as informações do responsável técnico
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">

          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome
            </Label>
            <Input
              id="nome"
              placeholder="Digite o nome completo..."
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                maxLength={14} // Limita o comprimento do campo formatado
                inputMode="numeric" // Mostra teclado numérico em dispositivos móveis
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro_profissional" className="text-sm font-medium">
                Registro Profissional
              </Label>
              <Input
                id="registro_profissional"
                placeholder="Digite o registro..."
                value={formData.registro_profissional}
                onChange={(e) => handleInputChange('registro_profissional', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="especialidade" className="text-sm font-medium">
              Especialidade
            </Label>
            <Input
              id="especialidade"
              placeholder="Digite a especialidade..."
              value={formData.especialidade}
              onChange={(e) => handleInputChange('especialidade', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ativo" className="text-sm font-medium">
              Status
            </Label>
            <Select 
              value={formData.ativo !== undefined ? (formData.ativo ? 'true' : 'false') : ''} 
              onValueChange={(value) => handleInputChange('ativo', value === 'true')}
            >
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
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
              className="flex-1 bg-[#F1860C] hover:bg-[#d6730a] text-white font-semibold"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditResponsavelTecnicoButton;
