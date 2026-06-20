"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { obrasService } from "@/services/obrasService";
import { responsaveisTecnicosService } from "@/services/responsaveisTecnicosService";
import { CreateFiscalizacaoDto } from "@/types/fiscalizacoes";
import { Plus } from "lucide-react";

interface CreateFiscalizacaoButtonProps {
  onSuccess: () => void;
}

const CreateFiscalizacaoButton = ({ onSuccess }: CreateFiscalizacaoButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [obras, setObras] = useState<Array<{id: number; nome: string}>>([]);
  const [responsaveis, setResponsaveis] = useState<Array<{id: number; nome: string; especialidade: string}>>([]);
  const [loadingObras, setLoadingObras] = useState(false);
  const [loadingResponsaveis, setLoadingResponsaveis] = useState(false);
  const [filtroObras, setFiltroObras] = useState<string>('');
  const [obraSelecionada, setObraSelecionada] = useState<{id: number; nome: string} | null>(null);
  const [formData, setFormData] = useState<CreateFiscalizacaoDto>({
    titulo: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    status: 'planejada',
    responsavelTecnicoId: 0,
    obraId: undefined
  });

  const loadData = async () => {
    setLoadingObras(true);
    setLoadingResponsaveis(true);
    
    try {
      const [obrasData, responsaveisData] = await Promise.all([
        obrasService.getAllObras(),
        responsaveisTecnicosService.getAllResponsaveisTecnicos()
      ]);
      
      setObras(obrasData);
      setResponsaveis(responsaveisData);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar dados");
    } finally {
      setLoadingObras(false);
      setLoadingResponsaveis(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

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

  const handleObraSelect = (obra: {id: number; nome: string}) => {
    setObraSelecionada(obra);
    handleInputChange('obraId', obra.id);
    setFiltroObras(`${obra.nome} (ID: ${obra.id})`);
  };

  const handleInputChange = (field: keyof CreateFiscalizacaoDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Remove a mensagem de erro quando o usuário começa a digitar
    if (error) {
      setError(null);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      data_inicio: '',
      data_fim: '',
      status: 'planejada',
      responsavelTecnicoId: 0,
      obraId: undefined
    });
    setFiltroObras('');
    setObraSelecionada(null);
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.titulo.trim()) {
      setError("O título da fiscalização é obrigatório");
      return false;
    }
    if (formData.titulo.trim().length < 3) {
      setError("O título deve ter pelo menos 3 caracteres");
      return false;
    }
    if (!formData.data_inicio) {
      setError("A data de início é obrigatória");
      return false;
    }
    if (!formData.data_fim) {
      setError("A data de fim é obrigatória");
      return false;
    }
    if (!formData.status) {
      setError("O status é obrigatório");
      return false;
    }
    if (!formData.responsavelTecnicoId || formData.responsavelTecnicoId <= 0) {
      setError("O ID do responsável é obrigatório e deve ser um número positivo");
      return false;
    }

    // Validação de datas
    const dataInicio = new Date(formData.data_inicio);
    const dataFim = new Date(formData.data_fim);
    
    if (dataInicio > dataFim) {
      setError("A data de início não pode ser posterior à data de fim");
      return false;
    }

    if (!formData.obraId || formData.obraId <= 0 || !obraSelecionada) {
      setError("É necessário selecionar uma obra da lista");
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
      const dataToSubmit: Omit<CreateFiscalizacaoDto, 'obraId'> = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao?.trim() || undefined,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        status: formData.status,
        responsavelTecnicoId: formData.responsavelTecnicoId
      };

      if (formData.obraId) {
        await fiscalizacoesService.createFiscalizacaoParaObra(formData.obraId, dataToSubmit);
      } else {
        throw new Error("Obra é obrigatória");
      }
      
      setIsOpen(false);
      resetForm();
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao criar fiscalização");
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
        <Button>
          <Plus className="mr-2 h-5 w-5" />
          Nova Fiscalização
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">
            Criar Nova Fiscalização
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 space-y-4">

              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-sm font-medium">
                  Título *
                </Label>
                <Input
                  id="titulo"
                  placeholder="Digite o título da fiscalização..."
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </Label>
                <textarea
                  id="descricao"
                  placeholder="Digite uma descrição para a fiscalização..."
                  value={formData.descricao || ''}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 border border-slate-300 rounded-md focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white resize-vertical"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio" className="text-sm font-medium">
                    Data de Início *
                  </Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                    className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_fim" className="text-sm font-medium">
                    Data de Fim *
                  </Label>
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => handleInputChange('data_fim', e.target.value)}
                    className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status *
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejada">Planejada</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavelTecnicoId" className="text-sm font-medium">
                    Responsável Técnico *
                  </Label>
                  {loadingResponsaveis ? (
                    <div className="flex items-center justify-center py-2 border rounded bg-gray-50">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Carregando...</span>
                    </div>
                  ) : (
                    <Select 
                      value={formData.responsavelTecnicoId ? formData.responsavelTecnicoId.toString() : ''} 
                      onValueChange={(value) => handleInputChange('responsavelTecnicoId', parseInt(value))}
                    >
                      <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white">
                        <SelectValue placeholder="Selecione o responsável técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveis.map((responsavel) => (
                          <SelectItem key={responsavel.id} value={responsavel.id.toString()}>
                            {responsavel.nome} - {responsavel.especialidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="obraId" className="text-sm font-medium">
                    Obra *
                  </Label>
                  {loadingObras ? (
                    <div className="flex items-center justify-center py-2 border rounded bg-gray-50">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Carregando...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="Digite o nome ou ID da obra..."
                        value={filtroObras}
                        onChange={(e) => {
                          setFiltroObras(e.target.value);
                          if (!e.target.value) {
                            setObraSelecionada(null);
                            handleInputChange('obraId', undefined);
                          }
                        }}
                        className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white"
                      />
                      {filtroObras && !obraSelecionada && obrasDisponiveis.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-md bg-white shadow-sm">
                          {obrasDisponiveis.slice(0, 5).map((obra) => (
                            <div
                              key={obra.id}
                              className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleObraSelect(obra)}
                            >
                              <div className="text-sm font-medium text-gray-900">{obra.nome}</div>
                              <div className="text-xs text-gray-500">ID: {obra.id}</div>
                            </div>
                          ))}
                          {obrasDisponiveis.length > 5 && (
                            <div className="px-3 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
                              ... e mais {obrasDisponiveis.length - 5} obra(s). Continue digitando para refinar.
                            </div>
                          )}
                        </div>
                      )}
                      {filtroObras && obrasDisponiveis.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center border border-slate-300 rounded-md bg-gray-50">
                          Nenhuma obra encontrada
                        </div>
                      )}
                      {obraSelecionada && (
                        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-green-900">Obra selecionada:</div>
                              <div className="text-sm text-green-700">{obraSelecionada.nome} (ID: {obraSelecionada.id})</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setObraSelecionada(null);
                                setFiltroObras('');
                                handleInputChange('obraId', undefined);
                              }}
                              className="text-green-600 hover:text-green-800 text-sm underline"
                            >
                              Alterar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                  'Criar Fiscalização'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFiscalizacaoButton;
