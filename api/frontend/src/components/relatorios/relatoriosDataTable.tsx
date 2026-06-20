"use client";

import { useState, useMemo, useRef } from "react";
import { Relatorio } from "@/types/relatorios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollText, Calendar, ChevronDown } from "lucide-react";
import DeleteRelatorioButton from "./deleteRelatorioButton";
import EditRelatorioButton from "./editRelatorioButton";
import ViewRelatorioButton from "./viewRelatorioButton";

interface RelatoriosDataTableProps {
  relatorios: Relatorio[];
  onSuccess: () => void;
}

export default function RelatoriosDataTable({ relatorios, onSuccess }: RelatoriosDataTableProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    id: '',
    titulo: '',
    dataCriacao: '',
    fiscalizacaoId: ''
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
    } catch (error) {
      return String(dateString);
    }
  };

  const getDateFromRelatorio = (relatorio: Relatorio): string => {
    const possibleDateFields = [
      'dataCriacao',
      'data_criacao',
      'createdAt', 
      'created_at', 
      'dataCreated', 
      'date_created',
      'createdDate'
    ];
    
    for (const field of possibleDateFields) {
      const value = relatorio[field];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }
    
    return '';
  };

  const filteredRelatorios = useMemo(() => {
    return relatorios.filter(relatorio => {
      const relatorioDate = getDateFromRelatorio(relatorio);
      
      let matchesDate = true;
      if (filters.dataCriacao !== 'all' && filters.dataCriacao !== '') {
        if (relatorioDate) {
          try {
            const relatorioDateOnly = relatorioDate.split('T')[0];
            const filterDateOnly = filters.dataCriacao;
            
            matchesDate = relatorioDateOnly === filterDateOnly;
          } catch {
            matchesDate = false;
          }
        } else {
          matchesDate = false;
        }
      }
      
      const result = (
        (filters.id === '' || relatorio.id.toString() === filters.id) &&
        (filters.titulo === '' || relatorio.titulo.toLowerCase().includes(filters.titulo.toLowerCase())) &&
        matchesDate &&
        (filters.fiscalizacaoId === '' || relatorio.fiscalizacaoId.toString() === filters.fiscalizacaoId)
      );
      
      return result;
    });
  }, [relatorios, filters]);

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
      dataCriacao: '',
      fiscalizacaoId: ''
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Data do Relatório
            </label>
            <div className="relative">
              <div 
                className="border border-slate-300 focus-within:border-[#F1860C] focus-within:ring-[#F1860C]/20 bg-white h-10 px-3 py-2 rounded-md flex items-center justify-between hover:border-slate-400 transition-colors relative z-10 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {filters.dataCriacao && filters.dataCriacao !== 'all' 
                      ? new Date(filters.dataCriacao + 'T00:00:00').toLocaleDateString('pt-BR') 
                      : 'Selecione uma data'
                    }
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <input
                ref={dateInputRef}
                type="date"
                value={filters.dataCriacao === 'all' ? '' : filters.dataCriacao}
                onChange={(e) => handleFilterChange('dataCriacao', e.target.value || 'all')}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
                style={{ margin: 0 }}
                onClick={() => {
                  if (dateInputRef.current) {
                    if (dateInputRef.current.showPicker) {
                      dateInputRef.current.showPicker();
                    } else {
                      dateInputRef.current.focus();
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              ID da Fiscalização
            </label>
            <Input
              placeholder="Digite o ID da fiscalização..."
              value={filters.fiscalizacaoId}
              onChange={(e) => handleFilterChange('fiscalizacaoId', e.target.value)}
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
                <TableHead className="text-white font-semibold">Data do Relatório</TableHead>
                <TableHead className="text-white font-semibold">ID Fiscalização</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRelatorios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <ScrollText className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhum relatório encontrado</p>
                      <p className="text-slate-400 text-sm">Ajuste os filtros ou crie um novo relatório</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRelatorios.map((relatorio, index) => (
                  <TableRow 
                    key={relatorio.id} 
                    className={`hover:bg-gray-100 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <TableCell className="font-semibold text-slate-800">{relatorio.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{relatorio.titulo}</TableCell>
                    <TableCell className="text-slate-600">{formatDate(getDateFromRelatorio(relatorio))}</TableCell>
                    <TableCell className="text-slate-600">{relatorio.fiscalizacaoId}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <ViewRelatorioButton relatorio={relatorio} />
                        <EditRelatorioButton relatorio={relatorio} onSuccess={onSuccess} />
                        <DeleteRelatorioButton relatorio={relatorio} onSuccess={onSuccess} />
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
