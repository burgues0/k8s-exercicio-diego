"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { equipamentosService } from "@/services/equipamentosService";
import { Equipamento, UpdateEquipamentoDto } from "@/types/equipamentos";
import { API_CONFIG } from "@/lib/config";
import { Edit } from "lucide-react";

interface EditEquipamentoButtonProps {
  equipamento: Equipamento;
  onSuccess: () => void;
}

export default function EditEquipamentoButton({ equipamento, onSuccess }: EditEquipamentoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UpdateEquipamentoDto>({
    nome: '',
    tipo: '',
    marca: '',
    modelo: '',
    numeroDeSerie: '',
    estado: undefined,
    fornecedorId: 0,
  });

  const isEquipamentoValid = equipamento && 
    equipamento.id && 
    typeof equipamento.id === 'number' && 
    equipamento.id > 0 && 
    !isNaN(equipamento.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const equipamentoId = equipamento?.id;
      
      if (!equipamentoId || equipamentoId === 0 || isNaN(equipamentoId)) {
        throw new Error(`ID do equipamento inválido: ${equipamentoId}. Não é possível atualizar o equipamento.`);
      }

      const dadosLimpos: Partial<UpdateEquipamentoDto> = {};
      
      if (formData.nome?.trim()) dadosLimpos.nome = formData.nome.trim();
      if (formData.tipo?.trim()) dadosLimpos.tipo = formData.tipo.trim();
      if (formData.marca?.trim()) dadosLimpos.marca = formData.marca.trim();
      if (formData.modelo?.trim()) dadosLimpos.modelo = formData.modelo.trim();
      if (formData.numeroDeSerie?.trim()) dadosLimpos.numeroDeSerie = formData.numeroDeSerie.trim();
      if (formData.estado) dadosLimpos.estado = formData.estado;
      if (formData.fornecedorId && formData.fornecedorId > 0) dadosLimpos.fornecedorId = formData.fornecedorId;
      
      if (Object.keys(dadosLimpos).length === 0) {
        throw new Error("Pelo menos um campo deve ser preenchido para atualizar o equipamento.");
      }
      
      const idFinal = Number(equipamentoId);
      if (isNaN(idFinal) || idFinal <= 0) {
        throw new Error(`ID do equipamento inválido após conversão: ${idFinal} (original: ${equipamentoId})`);
      }
      
      try {
        await equipamentosService.updateEquipamento(idFinal, dadosLimpos);
      } catch (updateError: unknown) {
        const error = updateError as Error;
        if (error.message.includes("WHERE parameter \"id\" has invalid \"undefined\" value") ||
            error.message.includes("obras do equipamento")) {
          
          let alternativeSuccess = false;
          
          try {
            const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}/api/equipamentos/${idFinal}`, {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dadosLimpos),
            });

            if (!response.ok) {
              throw new Error(`Erro HTTP: ${response.status}`);
            }

            alternativeSuccess = true;
          } catch {
            try {
              const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}/api/equipamentos/${idFinal}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosLimpos),
              });

              if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
              }

              alternativeSuccess = true;
            } catch {
              throw updateError;
            }
          }
          
          if (!alternativeSuccess) {
            throw updateError;
          }
        } else {
          throw updateError;
        }
      }
      
      setIsOpen(false);
      setFormData({
        nome: '',
        tipo: '',
        marca: '',
        modelo: '',
        numeroDeSerie: '',
        estado: undefined,
        fornecedorId: 0,
      });
      onSuccess();
    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || "Erro ao atualizar equipamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateEquipamentoDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isEquipamentoValid) {
    return (
      <Button variant="destructive" disabled>
        Equipamento Inválido
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Editar Equipamento</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-nome" className="text-slate-700 font-medium">Nome</Label>
                <Input
                  id="edit-nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome do equipamento"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tipo" className="text-slate-700 font-medium">Tipo</Label>
                <Input
                  id="edit-tipo"
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  placeholder="Tipo do equipamento"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-marca" className="text-slate-700 font-medium">Marca</Label>
                <Input
                  id="edit-marca"
                  type="text"
                  value={formData.marca}
                  onChange={(e) => handleInputChange('marca', e.target.value)}
                  placeholder="Marca do equipamento"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-modelo" className="text-slate-700 font-medium">Modelo</Label>
                <Input
                  id="edit-modelo"
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  placeholder="Modelo do equipamento"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-numero-serie" className="text-slate-700 font-medium">Número de Série</Label>
                <Input
                  id="edit-numero-serie"
                  type="text"
                  value={formData.numeroDeSerie}
                  onChange={(e) => handleInputChange('numeroDeSerie', e.target.value)}
                  placeholder="Número de série"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fornecedor" className="text-slate-700 font-medium">ID do Fornecedor</Label>
                <Input
                  id="edit-fornecedor"
                  type="number"
                  value={formData.fornecedorId || ''}
                  onChange={(e) => handleInputChange('fornecedorId', parseInt(e.target.value) || 0)}
                  placeholder="ID do fornecedor"
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-estado" className="text-slate-700 font-medium">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Usado">Usado</SelectItem>
                  <SelectItem value="Em_manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-800 font-medium">Erro ao atualizar equipamento</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}
                className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}
                className="text-white font-semibold px-8 shadow-lg"
                style={{ backgroundColor: '#F1860C' }}>
                {isLoading ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}