"use client";

import { useState, useMemo } from "react";
import { Obra } from "@/types/obras";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteObraButton from "@/components/obras/deleteObraButton";
import { Badge } from "@/components/ui/badge";
import { FileWarning } from "lucide-react";

interface ObrasDataTableProps {
  obras: Obra[];
  onDeleteSuccess: () => void;
}

export default function ObrasDataTable({ obras, onDeleteSuccess }: ObrasDataTableProps) {
  const [filters, setFilters] = useState({
    id: '',
    nome: '',
    status: '',
    data_inicio: '',
    data_conclusao: '',
    orcamento_total: '',
    percentual_concluido: ''
  });

  const filteredObras = useMemo(() => {
    return obras.filter(obra => {
      const matchesId = !filters.id || obra.id?.toString() === filters.id;
      const matchesNome = !filters.nome || (obra.nome && obra.nome.toLowerCase().includes(filters.nome.toLowerCase()));
      const matchesStatus = !filters.status || (obra.status && obra.status.toLowerCase().includes(filters.status.toLowerCase()));
      const matchesInicio = !filters.data_inicio || (obra.data_inicio && obra.data_inicio.includes(filters.data_inicio));
      const matchesConclusao = !filters.data_conclusao || (obra.data_conclusao && obra.data_conclusao.includes(filters.data_conclusao));
      const matchesOrcamento = !filters.orcamento_total || (obra.orcamento_total && obra.orcamento_total.toString().includes(filters.orcamento_total));
      const matchesPercentual = !filters.percentual_concluido || (obra.percentual_concluido && obra.percentual_concluido.toString().includes(filters.percentual_concluido));
      return matchesId && matchesNome && matchesStatus && matchesInicio && matchesConclusao && matchesOrcamento && matchesPercentual;
    });
  }, [obras, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      id: '',
      nome: '',
      status: '',
      data_inicio: '',
      data_conclusao: '',
      orcamento_total: '',
      percentual_concluido: ''
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">ID</label>
            <Input placeholder="Digite o ID..." value={filters.id} onChange={e => handleFilterChange('id', e.target.value)} className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Nome</label>
            <Input placeholder="Digite o nome..." value={filters.nome} onChange={e => handleFilterChange('nome', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Status</label>
            <Input placeholder="Digite o status..." value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Início</label>
            <Input placeholder="Data início..." value={filters.data_inicio} onChange={e => handleFilterChange('data_inicio', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Conclusão</label>
            <Input placeholder="Data conclusão..." value={filters.data_conclusao} onChange={e => handleFilterChange('data_conclusao', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Orçamento</label>
            <Input placeholder="Orçamento..." value={filters.orcamento_total} onChange={e => handleFilterChange('orcamento_total', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Concluído (%)</label>
            <Input placeholder="% Concluído..." value={filters.percentual_concluido} onChange={e => handleFilterChange('percentual_concluido', e.target.value)} className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10" />
          </div>
        </div>
      </div>
      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ background: '#B9B9B9' }} className="hover:bg-[#A5A5A5]">
                <TableHead className="text-white font-semibold">ID</TableHead>
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Início</TableHead>
                <TableHead className="text-white font-semibold">Conclusão</TableHead>
                <TableHead className="text-white font-semibold">Orçamento</TableHead>
                <TableHead className="text-white font-semibold">Concluído (%)</TableHead>
                <TableHead className="text-white font-semibold text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileWarning className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhuma obra encontrada</p>
                      <p className="text-slate-400 text-sm">Ajuste os filtros ou crie uma nova obra</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredObras.map((obra, index) => (
                  <TableRow
                    key={obra.id}
                    className={`hover:bg-gray-100 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <TableCell className="font-semibold text-slate-800">{obra.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{obra.nome}</TableCell>
                    <TableCell className="text-slate-600">{obra.status}</TableCell>
                    <TableCell className="text-slate-600">{obra.data_inicio}</TableCell>
                    <TableCell className="text-slate-600">{obra.data_conclusao || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600">R$ {obra.orcamento_total}</TableCell>
                    <TableCell className="text-slate-600">{obra.percentual_concluido}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/obras/${obra.id}`}><Button variant="outline" size="sm" className="mr-2">Ver</Button></Link>
                        <Link href={`/obras/${obra.id}/edit`}><Button variant="outline" size="sm" className="mr-2">Editar</Button></Link>
                        <DeleteObraButton obraId={obra.id} onSuccess={onDeleteSuccess} />
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