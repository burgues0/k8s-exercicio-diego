"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";
import { CreateResponsavelTecnicoDto } from "@/types/responsaveis-tecnicos";
import { Plus } from "lucide-react";

interface CreateResponsavelTecnicoButtonProps {
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

const CreateResponsavelTecnicoButton = ({ onSuccess }: CreateResponsavelTecnicoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateResponsavelTecnicoDto>({
    nome: '',
    cpf: '',
    registro_profissional: '',
    especialidade: '',
    ativo: true
  });

  const handleInputChange = (field: keyof CreateResponsavelTecnicoDto, value: string | boolean) => {
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

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      registro_profissional: '',
      especialidade: '',
      ativo: true
    });
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nome.trim()) {
      setError("O nome é obrigatório");
      return false;
    }
    if (formData.nome.trim().length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres");
      return false;
    }
    if (!formData.cpf.trim()) {
      setError("O CPF é obrigatório");
      return false;
    }
    if (!isValidCPF(formData.cpf)) {
      setError("CPF inválido. Verifique os números digitados");
      return false;
    }
    if (!formData.registro_profissional.trim()) {
      setError("O registro profissional é obrigatório");
      return false;
    }
    if (!formData.especialidade.trim()) {
      setError("A especialidade é obrigatória");
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
      const dataToSubmit: CreateResponsavelTecnicoDto = {
        nome: formData.nome.trim(),
        cpf: formData.cpf, // Envia CPF formatado (xxx.xxx.xxx-xx)
        registro_profissional: formData.registro_profissional.trim(),
        especialidade: formData.especialidade.trim(),
        ativo: formData.ativo
      };

      await responsaveisTecnicosService.createResponsavelTecnico(dataToSubmit);
      
      setIsOpen(false);
      resetForm();
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao criar responsável técnico");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: '#1B1816' }} className="hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="mr-2 h-5 w-5" />
          Novo Responsável Técnico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">
            Criar Novo Responsável Técnico
          </DialogTitle>
          <DialogDescription className="text-orange-100 mt-1">
            Preencha as informações para cadastrar um novo responsável técnico
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome completo..."
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm font-medium">
                    CPF *
                  </Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                    maxLength={14} // Limita o comprimento do campo formatado
                    inputMode="numeric" // Mostra teclado numérico em dispositivos móveis
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registro_profissional" className="text-sm font-medium">
                    Registro Profissional *
                  </Label>
                  <Input
                    id="registro_profissional"
                    placeholder="Digite o registro..."
                    value={formData.registro_profissional}
                    onChange={(e) => handleInputChange('registro_profissional', e.target.value)}
                    className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidade" className="text-sm font-medium">
                  Especialidade *
                </Label>
                <Input
                  id="especialidade"
                  placeholder="Digite a especialidade..."
                  value={formData.especialidade}
                  onChange={(e) => handleInputChange('especialidade', e.target.value)}
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ativo" className="text-sm font-medium">
                  Status *
                </Label>
                <Select value={formData.ativo ? 'true' : 'false'} onValueChange={(value) => handleInputChange('ativo', value === 'true')}>
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
                type="submit"
                disabled={isLoading}
                className="bg-[#F1860C] hover:bg-[#d6730a] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando...
                  </div>
                ) : (
                  'Criar Responsável Técnico'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResponsavelTecnicoButton;
