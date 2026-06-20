"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { equipamentosService } from "@/services/equipamentosService";
import { obrasService } from "@/services/obrasService";
import { CreateEquipamentoDto, Obra } from "@/types/equipamentos";

interface CreateEquipamentoButtonProps {
  onSuccess: () => void;
}

const CreateEquipamentoButton = ({ onSuccess }: CreateEquipamentoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObras, setSelectedObras] = useState<number[]>([]);
  const [filtroObras, setFiltroObras] = useState<string>('');
  const [formData, setFormData] = useState<CreateEquipamentoDto>({
    nome: '',
    tipo: '',
    marca: '',
    modelo: '',
    numeroDeSerie: '',
    estado: 'Novo',
    fornecedorId: 0,
  });

  useEffect(() => {
    if (isOpen) {
      loadObras();
    }
  }, [isOpen]);

  const loadObras = async () => {
    try {
      const obrasData = await obrasService.getAllObras();
      setObras(obrasData);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erro ao carregar obras:", error.message);
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

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: '',
      marca: '',
      modelo: '',
      numeroDeSerie: '',
      estado: 'Novo',
      fornecedorId: 0,
    });
    setSelectedObras([]);
    setFiltroObras('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.nome.trim()) {
        throw new Error("O nome do equipamento é obrigatório");
      }
      if (!formData.tipo.trim()) {
        throw new Error("O tipo do equipamento é obrigatório");
      }
      if (!formData.marca.trim()) {
        throw new Error("A marca do equipamento é obrigatória");
      }
      if (!formData.modelo.trim()) {
        throw new Error("O modelo do equipamento é obrigatório");
      }
      if (!formData.numeroDeSerie.trim()) {
        throw new Error("O número de série é obrigatório");
      }
      if (!formData.fornecedorId || formData.fornecedorId === 0) {
        throw new Error("O ID do fornecedor é obrigatório e deve ser maior que zero");
      }
      
      const dadosParaCriacao: CreateEquipamentoDto = {
        ...formData,
        ...(selectedObras.length > 0 && { obrasId: selectedObras })
      };
      
      const equipamentoCriado = await equipamentosService.createEquipamento(dadosParaCriacao);
      
      if (!equipamentoCriado) {
        throw new Error("Erro ao criar equipamento: Resposta vazia da API");
      }
      
      if (!equipamentoCriado.id || equipamentoCriado.id === 0) {
        throw new Error(`Erro ao criar equipamento: ID inválido retornado (${equipamentoCriado.id})`);
      }
      
      onSuccess();
      setIsOpen(false);
      resetForm();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Erro detalhado ao criar equipamento:", error);
      const errorMessage = error.message || "Erro ao criar equipamento";
      
      if (errorMessage.includes("ID inválido retornado")) {
        setError(`Erro na API: ${errorMessage}. Verifique se o backend está retornando o ID corretamente.`);
      } else if (errorMessage.includes("Resposta vazia da API")) {
        setError("Erro na API: O servidor não retornou dados do equipamento criado.");
      } else if (errorMessage.includes("Não foi possível conectar")) {
        setError("Erro de conexão: Verifique se o servidor está funcionando.");
      } else if (errorMessage.includes("HTTP 400")) {
        setError("Dados inválidos: Verifique se todos os campos obrigatórios foram preenchidos corretamente e se os IDs das obras são válidos.");
      } else if (errorMessage.includes("HTTP 401")) {
        setError("Erro de autenticação: Faça login novamente.");
      } else if (errorMessage.includes("HTTP 403")) {
        setError("Permissão negada: Você não tem autorização para criar equipamentos.");
      } else if (errorMessage.includes("HTTP 500")) {
        setError("Erro interno do servidor: Tente novamente em alguns momentos.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Novo Equipamento</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Criar Novo Equipamento</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-700 font-medium">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Ex: Escavadeira CAT 320"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-slate-700 font-medium">Tipo *</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Ex: Escavadeira"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="marca" className="text-slate-700 font-medium">Marca *</Label>
              <Input
                id="marca"
                value={formData.marca}
                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Ex: Caterpillar"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo" className="text-slate-700 font-medium">Modelo *</Label>
              <Input
                id="modelo"
                value={formData.modelo}
                onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Ex: 320GC"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numeroDeSerie" className="text-slate-700 font-medium">Número de Série *</Label>
              <Input
                id="numeroDeSerie"
                value={formData.numeroDeSerie}
                onChange={(e) => setFormData({...formData, numeroDeSerie: e.target.value})}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10 font-mono"
                placeholder="Ex: ABC123456789"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedorId" className="text-slate-700 font-medium">ID do Fornecedor *</Label>
              <Input
                id="fornecedorId"
                type="number"
                value={formData.fornecedorId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData, 
                    fornecedorId: value === '' ? 0 : parseInt(value) || 0
                  });
                }}
                className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
                placeholder="Ex: 1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado" className="text-slate-700 font-medium">Estado *</Label>
            <Select value={formData.estado} onValueChange={(value: string) => setFormData({...formData, estado: value})}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Novo">Novo</SelectItem>
                <SelectItem value="Usado">Usado</SelectItem>
                <SelectItem value="Danificado">Danificado</SelectItem>
                <SelectItem value="Em_manutencao">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seção de seleção de obras */}
          <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
            <div>
              <Label className="text-slate-700 font-medium text-lg">Obras (Opcional)</Label>
              <p className="text-sm text-gray-600 mt-1">Selecione as obras onde este equipamento será utilizado</p>
            </div>

            {/* Campo de filtro */}
            <div>
              <input
                type="text"
                placeholder="Buscar obra por nome ou ID..."
                value={filtroObras}
                onChange={(e) => setFiltroObras(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite para filtrar as obras disponíveis
              </p>
            </div>

            {/* Lista de obras */}
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
              {obrasDisponiveis.length > 0 ? (
                obrasDisponiveis.map((obra) => (
                  <div key={obra.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      id={`obra-create-${obra.id}`}
                      checked={selectedObras.includes(obra.id)}
                      onChange={() => handleToggleObra(obra.id)}
                      className="h-4 w-4"
                    />
                    <label 
                      htmlFor={`obra-create-${obra.id}`} 
                      className="text-sm font-medium leading-none cursor-pointer flex-1"
                    >
                      {obra.nome} (ID: {obra.id})
                    </label>
                  </div>
                ))
              ) : filtroObras.trim() ? (
                <p className="text-gray-500 text-sm p-2">
                  Nenhuma obra encontrada para &quot;{filtroObras}&quot;
                </p>
              ) : (
                <p className="text-gray-500 text-sm p-2">
                  Nenhuma obra disponível
                </p>
              )}
            </div>

            {selectedObras.length > 0 && (
              <div className="text-sm text-blue-600">
                {selectedObras.length} obra(s) selecionada(s)
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Erro ao criar equipamento</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          <DialogFooter className="flex gap-3 pt-6 border-t border-slate-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }} 
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
              {isLoading ? "Criando..." : "Criar Equipamento"}
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEquipamentoButton;
