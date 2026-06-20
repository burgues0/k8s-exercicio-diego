"use client";

import { useState, useMemo, useRef } from "react";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Calendar, ChevronDown } from "lucide-react";
import DeleteFiscalizacaoButton from "@/components/fiscalizacoes/deleteFiscalizacaoButton";
import EditFiscalizacaoButton from "@/components/fiscalizacoes/editFiscalizacaoButton";
import ViewFiscalizacaoButton from "@/components/fiscalizacoes/viewFiscalizacaoButton";
import ToggleStatusFiscalizacaoButton from "@/components/fiscalizacoes/toggleStatusFiscalizacaoButton";
import RelatoriosMenuButton from "@/components/fiscalizacoes/relatoriosMenuButton";
import AssignObrasFiscalizacaoButton from "@/components/fiscalizacoes/assignObrasFiscalizacaoButton";

interface FiscalizacoesDataTableProps {
  fiscalizacoes: Fiscalizacao[];
  onSuccess: () => void;
}

export default function FiscalizacoesDataTable({ fiscalizacoes, onSuccess }: FiscalizacoesDataTableProps) {
  const dateInicioInputRef = useRef<HTMLInputElement>(null);
  const dateFimInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    id: '',
    titulo: '',
    data_inicio: '',
    data_fim: '',
    status: 'all',
    responsavelId: ''
  });

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === null || dateString === undefined || dateString === '') {
      return 'N/A';
    }
    
  try {
    const dateOnly = dateString.split('T')[0];
    const date = new Date(dateOnly + 'T00:00:00');
      
      if (!isNaN(date.getTime())) {
        const formatted = date.toLocaleDateString('pt-BR');
        return formatted;
      }
      
      return String(dateString);
    } catch {
      return String(dateString);
    }
  };

  const getDateFromFiscalizacao = (fiscalizacao: Fiscalizacao, field: 'data_inicio' | 'data_fim'): string => {
    const value = fiscalizacao[field];
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
    return '';
  };

  const filteredFiscalizacoes = useMemo(() => {
    if (!Array.isArray(fiscalizacoes)) {
      return [];
    }

    return fiscalizacoes.filter(fiscalizacao => {
      if (!fiscalizacao || typeof fiscalizacao !== 'object') {
        return false;
      }

      // Filtro por ID
      const matchesId = !filters.id || fiscalizacao.id?.toString() === filters.id;
      
      // Filtro por título
      const matchesTitulo = !filters.titulo || 
        (fiscalizacao.titulo && fiscalizacao.titulo.toLowerCase().includes(filters.titulo.toLowerCase()));

      // Filtro por data de início
      let matchesDataInicio = true;
      if (filters.data_inicio) {
        const fiscalizacaoDateInicio = getDateFromFiscalizacao(fiscalizacao, 'data_inicio');
        if (fiscalizacaoDateInicio) {
          try {
            const fiscalizacaoDateOnly = fiscalizacaoDateInicio.split('T')[0];
            matchesDataInicio = fiscalizacaoDateOnly === filters.data_inicio;
          } catch {
            matchesDataInicio = false;
          }
        } else {
          matchesDataInicio = false;
        }
      }

      // Filtro por data de fim
      let matchesDataFim = true;
      if (filters.data_fim) {
        const fiscalizacaoDateFim = getDateFromFiscalizacao(fiscalizacao, 'data_fim');
        if (fiscalizacaoDateFim) {
          try {
            const fiscalizacaoDateOnly = fiscalizacaoDateFim.split('T')[0];
            matchesDataFim = fiscalizacaoDateOnly === filters.data_fim;
          } catch {
            matchesDataFim = false;
          }
        } else {
          matchesDataFim = false;
        }
      }

      // Filtro por status
      let matchesStatus = true;
      if (filters.status && filters.status !== 'all') {
        const fiscalizacaoStatus = fiscalizacao.status?.toString().trim().toLowerCase() || '';
        const filterStatus = filters.status.toString().trim().toLowerCase();
        
        const statusMapping: { [key: string]: string[] } = {
          'planejada': ['planejada', 'planejado'],
          'em_andamento': ['em andamento', 'em_andamento'],
          'concluida': ['concluída', 'concluida', 'finalizada']
        };
        
        const possibleValues = statusMapping[filterStatus] || [filterStatus];
        matchesStatus = possibleValues.includes(fiscalizacaoStatus);
      }

      // Filtro por responsável
      const matchesResponsavel = !filters.responsavelId || 
        fiscalizacao.responsavelTecnicoId?.toString() === filters.responsavelId;

      return matchesId && matchesTitulo && matchesDataInicio && matchesDataFim && matchesStatus && matchesResponsavel;
    });
  }, [fiscalizacoes, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      id: '',
      titulo: '',
      data_inicio: '',
      data_fim: '',
      status: 'all',
      responsavelId: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'planejada': { label: 'Planejada', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'em_andamento': { label: 'Em Andamento', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'concluida': { label: 'Concluída', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Filtros de Pesquisa</h3>
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar Filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              ID
            </label>
            <Input
              placeholder="Digite o ID..."
              value={filters.id}
              onChange={(e) => handleFilterChange('id', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Título
            </label>
            <Input
              placeholder="Digite o título..."
              value={filters.titulo}
              onChange={(e) => handleFilterChange('titulo', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Data de Início
            </label>
            <div className="relative">
              <div 
                className="border border-slate-300 focus-within:border-[#F1860C] focus-within:ring-[#F1860C]/20 bg-white h-10 px-3 py-2 rounded-md flex items-center justify-between hover:border-slate-400 transition-colors relative z-10 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {filters.data_inicio 
                      ? new Date(filters.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR') 
                      : 'Selecione uma data'
                    }
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <input
                ref={dateInicioInputRef}
                type="date"
                value={filters.data_inicio}
                onChange={(e) => handleFilterChange('data_inicio', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
                style={{ margin: 0 }}
                onClick={() => {
                  if (dateInicioInputRef.current) {
                    if (dateInicioInputRef.current.showPicker) {
                      dateInicioInputRef.current.showPicker();
                    } else {
                      dateInicioInputRef.current.focus();
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Data de Fim
            </label>
            <div className="relative">
              <div 
                className="border border-slate-300 focus-within:border-[#F1860C] focus-within:ring-[#F1860C]/20 bg-white h-10 px-3 py-2 rounded-md flex items-center justify-between hover:border-slate-400 transition-colors relative z-10 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {filters.data_fim 
                      ? new Date(filters.data_fim + 'T00:00:00').toLocaleDateString('pt-BR') 
                      : 'Selecione uma data'
                    }
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <input
                ref={dateFimInputRef}
                type="date"
                value={filters.data_fim}
                onChange={(e) => handleFilterChange('data_fim', e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
                style={{ margin: 0 }}
                onClick={() => {
                  if (dateFimInputRef.current) {
                    if (dateFimInputRef.current.showPicker) {
                      dateFimInputRef.current.showPicker();
                    } else {
                      dateFimInputRef.current.focus();
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Status
            </label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="planejada">Planejada</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              ID Responsável
            </label>
            <Input
              placeholder="Digite o ID do responsável..."
              value={filters.responsavelId}
              onChange={(e) => handleFilterChange('responsavelId', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>
        </div>
      </div>

      {/* Seção da Tabela */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ background: '#B9B9B9' }} className="hover:bg-[#A5A5A5]">
                <TableHead className="text-white font-semibold">ID</TableHead>
                <TableHead className="text-white font-semibold">Título</TableHead>
                <TableHead className="text-white font-semibold">Data Início</TableHead>
                <TableHead className="text-white font-semibold">Data Fim</TableHead>
                <TableHead className="text-white font-semibold min-w-[120px]">Status</TableHead>
                <TableHead className="text-white font-semibold">ID Responsável</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiscalizacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <ClipboardCheck className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhuma fiscalização encontrada</p>
                      <p className="text-slate-400 text-sm">Ajuste os filtros ou crie uma nova fiscalização</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFiscalizacoes.map((fiscalizacao, index) => (
                  <TableRow 
                    key={fiscalizacao.id} 
                    className={`hover:bg-gray-100 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <TableCell className="font-semibold text-slate-800">{fiscalizacao.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{fiscalizacao.titulo}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(getDateFromFiscalizacao(fiscalizacao, 'data_inicio'))}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(getDateFromFiscalizacao(fiscalizacao, 'data_fim'))}</TableCell>
                    <TableCell className="min-w-[120px]">{getStatusBadge(fiscalizacao.status)}</TableCell>
                    <TableCell className="text-slate-600">{fiscalizacao.responsavelTecnicoId || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <ViewFiscalizacaoButton fiscalizacao={fiscalizacao} />
                        <EditFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={onSuccess} />
                        <ToggleStatusFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={onSuccess} />
                        <AssignObrasFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={onSuccess} />
                        <RelatoriosMenuButton fiscalizacao={fiscalizacao} onSuccess={onSuccess} />
                        <DeleteFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={onSuccess} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
