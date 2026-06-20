"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { materiaisService } from "@/services/materiaisService";
import { CreateMaterialDto } from "@/types/materiais";

interface CreateMaterialButtonProps {
  onSuccess: () => void;
}

export default function CreateMaterialButton({ onSuccess }: CreateMaterialButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<CreateMaterialDto>({
    codigo: '',
    nome: '',
    unidadeMedida: '',
    descricao: '',
    precoUnitario: undefined,
    fabricante: '',
    modelo: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        codigo: '',
        nome: '',
        unidadeMedida: '',
        descricao: '',
        precoUnitario: undefined,
        fabricante: '',
        modelo: ''
      });
      setError(null);
      setFieldErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.codigo.trim()) {
      errors.codigo = 'Código é obrigatório';
    } else if (formData.codigo.trim().length < 2) {
      errors.codigo = 'Código deve ter pelo menos 2 caracteres';
    }

    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.fabricante?.trim()) {
      errors.fabricante = 'Fabricante é obrigatório';
    }

    if (!formData.modelo?.trim()) {
      errors.modelo = 'Modelo é obrigatório';
    }

    if (!formData.unidadeMedida?.trim()) {
      errors.unidadeMedida = 'Unidade de medida é obrigatória';
    }

    if (!formData.precoUnitario || formData.precoUnitario <= 0) {
      errors.precoUnitario = 'Preço unitário é obrigatório e deve ser maior que zero';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanedData: CreateMaterialDto = {
        ...formData,
        codigo: formData.codigo.trim(),
        nome: formData.nome.trim(),
        unidadeMedida: formData.unidadeMedida?.trim() || '',
        descricao: formData.descricao?.trim() || '',
        fabricante: formData.fabricante?.trim() || '',
        modelo: formData.modelo?.trim() || ''
      };

      await materiaisService.createMaterial(cleanedData);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao criar material");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateMaterialDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Novo Material</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Criar Novo Material</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
                Código *
              </Label>
              <Input
                id="codigo"
                type="text"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Ex: MAT-001"
                className={`bg-white ${fieldErrors.codigo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.codigo && (
                <p className="text-red-500 text-sm">{fieldErrors.codigo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Ex: Cimento CP II"
                className={`bg-white ${fieldErrors.nome ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.nome && (
                <p className="text-red-500 text-sm">{fieldErrors.nome}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabricante" className="text-sm font-medium text-gray-700">
                Fabricante *
              </Label>
              <Input
                id="fabricante"
                type="text"
                value={formData.fabricante}
                onChange={(e) => handleInputChange('fabricante', e.target.value)}
                placeholder="Ex: Votorantim"
                className={`bg-white ${fieldErrors.fabricante ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.fabricante && (
                <p className="text-red-500 text-sm">{fieldErrors.fabricante}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelo" className="text-sm font-medium text-gray-700">
                Modelo *
              </Label>
              <Input
                id="modelo"
                type="text"
                value={formData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                placeholder="Ex: CPB-40"
                className={`bg-white ${fieldErrors.modelo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.modelo && (
                <p className="text-red-500 text-sm">{fieldErrors.modelo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unidadeMedida" className="text-sm font-medium text-gray-700">
                Unidade de Medida *
              </Label>
              <Input
                id="unidadeMedida"
                type="text"
                value={formData.unidadeMedida}
                onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
                placeholder="Ex: Saco 50kg, m², L"
                className={`bg-white ${fieldErrors.unidadeMedida ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.unidadeMedida && (
                <p className="text-red-500 text-sm">{fieldErrors.unidadeMedida}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precoUnitario" className="text-sm font-medium text-gray-700">
                Preço Unitário (R$) *
              </Label>
              <Input
                id="precoUnitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.precoUnitario !== undefined ? formData.precoUnitario : ''}
                onChange={(e) => handleInputChange('precoUnitario', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                placeholder="Ex: 25.99"
                className={`bg-white ${fieldErrors.precoUnitario ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
              />
              {fieldErrors.precoUnitario && (
                <p className="text-red-500 text-sm">{fieldErrors.precoUnitario}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descrição detalhada do material..."
              className="bg-white border-gray-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 min-h-[80px]"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">Erro ao criar material</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#F1860C] hover:bg-[#e6790b] text-white shadow-lg min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Criar Material
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
