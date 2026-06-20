"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fornecedoresService } from "@/services/fornecedoresService";
import { obrasService } from "@/services/obrasService";
import { Fornecedor, UpdateFornecedorDto } from "@/types/fornecedores";
import { Obra } from "@/types/obras";
import { Edit } from "lucide-react";

interface EditFornecedorButtonProps {
  fornecedor: Fornecedor;
  onSuccess: () => void;
}

export default function EditFornecedorButton({ fornecedor, onSuccess }: EditFornecedorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateFornecedorDto>({
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

  const handleToggleObra = (obraId: number) => {
    setSelectedObras(prev => 
      prev.includes(obraId) 
        ? prev.filter(id => id !== obraId)
        : [...prev, obraId]
    );
  };

  const handleInputChange = (field: keyof UpdateFornecedorDto, value: string | boolean) => {
    if (field === 'cnpj' && typeof value === 'string') {
      // Formatação do CNPJ: XX.XXX.XXX/XXXX-XX
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
      // Formatação do telefone: (XX) XXXXX-XXXX
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
    setIsLoading(true);
    setError(null);

    try {
      const dadosLimpos: Partial<UpdateFornecedorDto> = {};
      
      if (formData.nome?.trim()) dadosLimpos.nome = formData.nome.trim();
      if (formData.cnpj?.trim()) dadosLimpos.cnpj = formData.cnpj.replace(/\D/g, '');
      if (formData.telefone?.trim()) dadosLimpos.telefone = formData.telefone.trim();
      if (formData.email?.trim()) dadosLimpos.email = formData.email.trim();
      if (formData.endereco?.trim()) dadosLimpos.endereco = formData.endereco.trim();
      
      if (selectedObras.length > 0) {
        dadosLimpos.obrasId = selectedObras;
      }
      
      if (Object.keys(dadosLimpos).length === 0) {
        throw new Error("Pelo menos um campo deve ser alterado para atualizar o fornecedor.");
      }

      await fornecedoresService.updateFornecedor(fornecedor.id, dadosLimpos);
      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      let errorMessage = error.message || "Erro ao atualizar fornecedor";
      if (errorMessage.startsWith("Erro ao atualizar fornecedor:")) {
        errorMessage = errorMessage.replace("Erro ao atualizar fornecedor:", "").trim();
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonSubmit = async () => {
    setError(null);

    setIsLoading(true);

    try {
      const fornecedorData = {
        nome: formData.nome,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        ativo: formData.ativo,
      };

      await fornecedoresService.updateFornecedor(fornecedor.id, fornecedorData);

      setIsOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Erro ao atualizar fornecedor');
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
          <DialogTitle className="text-xl font-bold">Editar Fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="nome" className="text-slate-700 font-medium">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Nome do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-slate-700 font-medium">CNPJ</Label>
              <Input
                id="cnpj"
                type="text"
                value={formData.cnpj || ''}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="XX.XXX.XXX/XXXX-XX"
                maxLength={18}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-700 font-medium">Telefone</Label>
              <Input
                id="telefone"
                type="text"
                value={formData.telefone || ''}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="endereco" className="text-slate-700 font-medium">Endereço</Label>
              <Textarea
                id="endereco"
                value={formData.endereco || ''}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                placeholder="Endereço completo do fornecedor"
                rows={3}
              />
            </div>
          </div>

          {/* Seção de Gestão de Obras */}
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800">Selecionar Obras</h3>
            
            {/* Campo de filtro para pesquisar obras */}
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

            {/* Lista de todas as obras com checkboxes */}
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

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
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
              className="bg-[#F1860C] hover:bg-[#e07a0b] text-white"
              onClick={handleButtonSubmit}
            >
              {isLoading ? "Atualizando..." : "Atualizar Fornecedor"}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
