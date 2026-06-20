"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fornecedoresService } from "@/services/fornecedoresService";
import { obrasService } from "@/services/obrasService";
import { CreateFornecedorDto } from "@/types/fornecedores";
import { Obra } from "@/types/obras";

interface CreateFornecedorButtonProps {
  onSuccess: () => void;
}

export default function CreateFornecedorButton({ onSuccess }: CreateFornecedorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<CreateFornecedorDto>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObras, setSelectedObras] = useState<number[]>([]);
  const [filtroObras, setFiltroObras] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: ''
      });
      setError(null);
      setFieldErrors({});
      loadObras();
      setSelectedObras([]);
      setFiltroObras('');
    }
  }, [isOpen]);

  const loadObras = async () => {
    try {
      const obrasData = await obrasService.getAllObras();
      setObras(obrasData);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar obras");
    }
  };

  const obrasDisponiveis = useMemo(() => {
    if (!filtroObras.trim()) {
      return obras;
    }

    const filtroLowerCase = filtroObras.toLowerCase().trim();
    return obras.filter(obra => 
      obra.nome.toLowerCase().includes(filtroLowerCase) ||
      obra.id.toString().includes(filtroLowerCase)
    );
  }, [obras, filtroObras]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCNPJ = (cnpj: string): boolean => {
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1+$/.test(digits)) return false;
    return true;
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.cnpj.trim()) {
      errors.cnpj = 'CNPJ é obrigatório';
    } else if (!validateCNPJ(formData.cnpj)) {
      errors.cnpj = 'CNPJ deve ter 14 dígitos e estar em formato válido';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Email deve ter um formato válido (exemplo: usuario@dominio.com)';
    }

    if (formData.telefone.trim()) {
      const telefoneDigits = formData.telefone.replace(/\D/g, '');
      if (telefoneDigits.length < 10) {
        errors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
      }
    }

    if (!formData.endereco.trim()) {
      errors.endereco = 'Endereço é obrigatório';
    } else if (formData.endereco.trim().length < 10) {
      errors.endereco = 'Endereço deve ter pelo menos 10 caracteres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleToggleObra = (obraId: number) => {
    setSelectedObras(prev => 
      prev.includes(obraId) 
        ? prev.filter(id => id !== obraId)
        : [...prev, obraId]
    );
  };

  const handleInputChange = (field: keyof CreateFornecedorDto, value: string | boolean) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field === 'cnpj' && typeof value === 'string') {
      const cnpj = value.replace(/\D/g, '');
      let formattedCnpj = cnpj;
      
      if (cnpj.length > 2) {
        formattedCnpj = cnpj.substring(0, 2) + '.' + cnpj.substring(2);
      }
      if (cnpj.length > 5) {
        formattedCnpj = cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + cnpj.substring(5);
      }
      if (cnpj.length > 8) {
        formattedCnpj = cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + cnpj.substring(5, 8) + '/' + cnpj.substring(8);
      }
      if (cnpj.length > 12) {
        formattedCnpj = cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + cnpj.substring(5, 8) + '/' + cnpj.substring(8, 12) + '-' + cnpj.substring(12, 14);
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: formattedCnpj
      }));
    } else if (field === 'telefone' && typeof value === 'string') {
      const telefone = value.replace(/\D/g, '');
      let formattedTelefone = telefone;
      
      if (telefone.length > 0) {
        formattedTelefone = '(' + telefone;
      }
      if (telefone.length > 2) {
        formattedTelefone = '(' + telefone.substring(0, 2) + ') ' + telefone.substring(2);
      }
      if (telefone.length > 7) {
        formattedTelefone = '(' + telefone.substring(0, 2) + ') ' + telefone.substring(2, 7) + '-' + telefone.substring(7, 11);
      }
      
      setFormData(prev => ({
        ...prev,
        [field]: formattedTelefone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    setIsLoading(true);

    try {
      const fornecedorData = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        telefone: formData.telefone,
        ativo: true,
        ...(selectedObras.length > 0 && { obrasId: selectedObras })
      };
      await fornecedoresService.createFornecedor(fornecedorData);
      setIsOpen(false);
      setFormData({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: ''
      });
      setSelectedObras([]);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      let errorMessage = error.message || "Erro ao criar fornecedor";
      if (errorMessage.startsWith("Erro ao criar fornecedor:")) {
        errorMessage = errorMessage.replace("Erro ao criar fornecedor:", "").trim();
      }
      
      if (errorMessage.includes('nome should not be empty')) {
        setFieldErrors(prev => ({...prev, nome: 'Nome é obrigatório'}));
      }
      if (errorMessage.includes('email must be an email')) {
        setFieldErrors(prev => ({...prev, email: 'Email deve ter um formato válido'}));
      }
      if (errorMessage.includes('cnpj')) {
        setFieldErrors(prev => ({...prev, cnpj: 'CNPJ inválido'}));
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonSubmit = async () => {
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    setIsLoading(true);

    try {
      const fornecedorData = {
        nome: formData.nome,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        ativo: true,
        ...(selectedObras.length > 0 && { obrasId: selectedObras })
      };

      await fornecedoresService.createFornecedor(fornecedorData);

      // Reset form
      setFormData({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: ''
      });
      setSelectedObras([]);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erro ao criar fornecedor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Novo Fornecedor</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Criar Novo Fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="nome" className="text-slate-700 font-medium">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10 ${
                  fieldErrors.nome ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Nome do fornecedor"
                required
              />
              {fieldErrors.nome && (
                <p className="text-red-600 text-sm">{fieldErrors.nome}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-slate-700 font-medium">
                CNPJ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                className={`border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10 ${
                  fieldErrors.cnpj ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="XX.XXX.XXX/XXXX-XX"
                maxLength={18}
                required
              />
              {fieldErrors.cnpj && (
                <p className="text-red-600 text-sm">{fieldErrors.cnpj}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-700 font-medium">
                Telefone
              </Label>
              <Input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className={`border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10 ${
                  fieldErrors.telefone ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
              {fieldErrors.telefone && (
                <p className="text-red-600 text-sm">{fieldErrors.telefone}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10 ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="email@exemplo.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-600 text-sm">{fieldErrors.email}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="endereco" className="text-slate-700 font-medium">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className={`border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white ${
                  fieldErrors.endereco ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Endereço completo do fornecedor"
                rows={3}
                required
              />
              {fieldErrors.endereco && (
                <p className="text-red-600 text-sm">{fieldErrors.endereco}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800">Selecionar Obras (Opcional)</h3>
            
            <div className="mb-3">
              <input
                type="text"
                placeholder="Buscar obra por nome ou ID..."
                value={filtroObras}
                onChange={(e) => setFiltroObras(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                style={{ backgroundColor: '#f9f9f9' }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite para filtrar as obras disponíveis
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
              {obrasDisponiveis.map((obra) => (
                <div key={obra.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`obra-${obra.id}`}
                    checked={selectedObras.includes(obra.id)}
                    onChange={() => handleToggleObra(obra.id)}
                    className="h-4 w-4"
                  />
                  <label 
                    htmlFor={`obra-${obra.id}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {obra.nome} (ID: {obra.id})
                  </label>
                </div>
              ))}
              {obrasDisponiveis.length === 0 && obras.length > 0 && (
                <p className="text-gray-500 text-sm">
                  {filtroObras.trim() 
                    ? `Nenhuma obra encontrada para "${filtroObras}"`
                    : "Nenhuma obra disponível"
                  }
                </p>
              )}
              {obras.length === 0 && (
                <p className="text-gray-500 text-sm">Nenhuma obra disponível</p>
              )}
            </div>
          </div>

          {(error || Object.keys(fieldErrors).length > 0) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">{error || 'Todos os campos obrigatórios devem ser preenchidos.'}</p>
                </div>
              </div>
            </div>
          )}

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
              disabled={isLoading}
              className="bg-[#F1860C] hover:bg-[#e07a0b] text-white"
              onClick={handleButtonSubmit}
            >
              {isLoading ? "Criando..." : "Criar Fornecedor"}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
