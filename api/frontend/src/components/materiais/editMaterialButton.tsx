"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { materiaisService } from "@/services/materiaisService";
import { Material, UpdateMaterialDto } from "@/types/materiais";
import { Edit } from "lucide-react";

interface EditMaterialButtonProps {
  material: Material;
  onSuccess: () => void;
}

export default function EditMaterialButton({ material, onSuccess }: EditMaterialButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<UpdateMaterialDto>({
    codigo: '',
    nome: '',
    unidadeMedida: '',
    descricao: '',
    precoUnitario: undefined,
    fabricante: '',
    modelo: ''
  });

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0,00' : numPrice.toFixed(2).replace('.', ',');
  };

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

    if (formData.codigo && formData.codigo.trim().length < 2) {
      errors.codigo = 'Código deve ter pelo menos 2 caracteres';
    }

    if (formData.nome && formData.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (formData.precoUnitario !== undefined && formData.precoUnitario <= 0) {
      errors.precoUnitario = 'Preço unitário deve ser maior que zero';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateMaterialDto, value: string | number | undefined) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dadosLimpos: Partial<UpdateMaterialDto> = {};
      
      if (formData.codigo?.trim()) dadosLimpos.codigo = formData.codigo.trim();
      if (formData.nome?.trim()) dadosLimpos.nome = formData.nome.trim();
      if (formData.unidadeMedida?.trim()) dadosLimpos.unidadeMedida = formData.unidadeMedida.trim();
      if (formData.descricao?.trim()) dadosLimpos.descricao = formData.descricao.trim();
      if (formData.precoUnitario !== undefined && formData.precoUnitario > 0) dadosLimpos.precoUnitario = formData.precoUnitario;
      if (formData.fabricante?.trim()) dadosLimpos.fabricante = formData.fabricante.trim();
      if (formData.modelo?.trim()) dadosLimpos.modelo = formData.modelo.trim();

      await materiaisService.updateMaterial(material.id, dadosLimpos);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao atualizar material");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Editar Material</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Informações Básicas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
                  Código
                </Label>
                <Input
                  id="codigo"
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder={`Atual: ${material.codigo}`}
                  className={`${fieldErrors.codigo ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
                />
                {fieldErrors.codigo && (
                  <p className="text-red-500 text-sm">{fieldErrors.codigo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                  Nome
                </Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder={`Atual: ${material.nome}`}
                  className={`${fieldErrors.nome ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
                />
                {fieldErrors.nome && (
                  <p className="text-red-500 text-sm">{fieldErrors.nome}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fabricante" className="text-sm font-medium text-gray-700">
                  Fabricante
                </Label>
                <Input
                  id="fabricante"
                  type="text"
                  value={formData.fabricante}
                  onChange={(e) => handleInputChange('fabricante', e.target.value)}
                  placeholder={`Atual: ${material.fabricante || 'Não informado'}`}
                  className="border-gray-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-sm font-medium text-gray-700">
                  Modelo
                </Label>
                <Input
                  id="modelo"
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder={`Atual: ${material.modelo || 'Não informado'}`}
                  className="border-gray-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidadeMedida" className="text-sm font-medium text-gray-700">
                  Unidade de Medida
                </Label>
                <Input
                  id="unidadeMedida"
                  type="text"
                  value={formData.unidadeMedida}
                  onChange={(e) => handleInputChange('unidadeMedida', e.target.value)}
                  placeholder={`Atual: ${material.unidadeMedida || 'Não informado'}`}
                  className="border-gray-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="precoUnitario" className="text-sm font-medium text-gray-700">
                  Preço Unitário (R$)
                </Label>
                <Input
                  id="precoUnitario"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoUnitario !== undefined ? formData.precoUnitario : ''}
                  onChange={(e) => handleInputChange('precoUnitario', e.target.value === '' ? undefined : parseFloat(e.target.value) || 0)}
                  placeholder={`Atual: R$ ${formatPrice(material.precoUnitario)}`}
                  className={`${fieldErrors.precoUnitario ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#F1860C]'} focus:ring-[#F1860C]/20`}
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
                placeholder={`Atual: ${material.descricao || 'Não informado'}`}
                className="border-gray-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 min-h-[80px]"
              />
            </div>
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
                  <p className="text-red-800 font-medium">Erro ao atualizar material</p>
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
                  Salvando...
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar Alterações
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
