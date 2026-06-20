"use client";

import { useState, useMemo } from "react";
import { Fornecedor } from "@/types/fornecedores";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DeleteFornecedorButton from "./deleteFornecedorButton";
import EditFornecedorButton from "./editFornecedorButton";
import ViewFornecedorButton from "./viewFornecedorButton";
import ToggleStatusFornecedorButton from "./toggleStatusFornecedorButton";

interface FornecedoresDataTableProps {
  fornecedores: Fornecedor[];
  onSuccess: () => void;
}

export default function FornecedoresDataTable({ fornecedores, onSuccess }: FornecedoresDataTableProps) {
  const [filters, setFilters] = useState({
    id: '',
    nome: '',
    cnpj: '',
    email: '',
    ativo: 'all'
  });

  const filteredFornecedores = useMemo(() => {
    return fornecedores.filter(fornecedor => {
      return (
        (filters.id === '' || fornecedor.id.toString() === filters.id) &&
        (filters.nome === '' || fornecedor.nome.toLowerCase().startsWith(filters.nome.toLowerCase())) &&
        (filters.cnpj === '' || fornecedor.cnpj.toLowerCase().startsWith(filters.cnpj.toLowerCase())) &&
        (filters.email === '' || fornecedor.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (filters.ativo === 'all' || 
          (filters.ativo === 'true' && fornecedor.ativo) ||
          (filters.ativo === 'false' && !fornecedor.ativo)
        )
      );
    });
  }, [fornecedores, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      id: '',
      nome: '',
      cnpj: '',
      email: '',
      ativo: 'all'
    });
  };

  return (
    <div className="space-y-6">
      {/* Seção de Filtros */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">ID</label>
            <Input
              placeholder="Filtrar por ID..."
              value={filters.id}
              onChange={(e) => handleFilterChange('id', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Nome</label>
            <Input
              placeholder="Filtrar por nome..."
              value={filters.nome}
              onChange={(e) => handleFilterChange('nome', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">CNPJ</label>
            <Input
              placeholder="Filtrar por CNPJ..."
              value={filters.cnpj}
              onChange={(e) => handleFilterChange('cnpj', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Email</label>
            <Input
              placeholder="Filtrar por email..."
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Status</label>
            <Select value={filters.ativo} onValueChange={(value) => handleFilterChange('ativo', value)}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 h-10">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">CNPJ</TableHead>
                <TableHead className="text-white font-semibold w-48 max-w-48">Email</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Telefone</TableHead>
                <TableHead className="text-white font-semibold">Endereço</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFornecedores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg">Nenhum fornecedor encontrado</p>
                      <p className="text-slate-400 text-sm">Tente ajustar os filtros de pesquisa</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFornecedores.map((fornecedor, index) => {
                  if (!fornecedor.id || fornecedor.id === 0 || isNaN(fornecedor.id)) {
                    console.error('ERRO: Fornecedor com ID inválido encontrado:', {
                      fornecedor,
                      id: fornecedor.id,
                      index,
                      idType: typeof fornecedor.id
                    });
                  }
                  
                  return (
                    <TableRow 
                      key={fornecedor.id || `fornecedor-${index}`} 
                      className={`hover:bg-gray-100 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                    <TableCell className="font-semibold text-slate-800">{fornecedor.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{fornecedor.nome}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">{fornecedor.cnpj}</TableCell>
                    <TableCell className="text-slate-600 w-48 max-w-48 truncate" title={fornecedor.email}>{fornecedor.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={fornecedor.ativo ? "default" : "default"}
                        className={fornecedor.ativo ? "bg-white text-black border border-gray-300 hover:bg-gray-50" : ""}
                      >
                        {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{fornecedor.telefone}</TableCell>
                    <TableCell className="text-slate-600">{fornecedor.endereco}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ViewFornecedorButton fornecedor={fornecedor} />
                        <EditFornecedorButton 
                          fornecedor={fornecedor} 
                          onSuccess={onSuccess} 
                        />
                        <ToggleStatusFornecedorButton fornecedor={fornecedor} onSuccess={onSuccess} />
                        <DeleteFornecedorButton fornecedorId={fornecedor.id} onSuccess={onSuccess} />
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
