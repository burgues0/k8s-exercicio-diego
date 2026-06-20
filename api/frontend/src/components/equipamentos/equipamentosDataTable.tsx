"use client";

import { useState, useMemo, useEffect } from "react";
import { Equipamento } from "@/types/equipamentos";
import { Fornecedor } from "@/types/fornecedores";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench } from "lucide-react";
import { fornecedoresService } from "@/services/fornecedoresService";
import DeleteEquipamentoButton from "@/components/equipamentos/deleteEquipamentoButton";
import EditEquipamentoButton from "@/components/equipamentos/editEquipamentoButton";
import ViewEquipamentoButton from "@/components/equipamentos/viewEquipamentoButton";
import AssignObrasButton from "@/components/equipamentos/assignObrasButton";

interface EquipamentosDataTableProps {
  equipamentos: Equipamento[];
  onSuccess: () => void;
}

export default function EquipamentosDataTable({ equipamentos, onSuccess }: EquipamentosDataTableProps) {
  const [filters, setFilters] = useState({
    id: '',
    nome: '',
    tipo: 'all',
    marca: 'all',
    numeroDeSerie: '',
    estado: 'all',
    fornecedor: ''
  });
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  useEffect(() => {
    const loadFornecedores = async () => {
      try {
        const fornecedoresData = await fornecedoresService.getAllFornecedores();
        setFornecedores(fornecedoresData);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    };
    loadFornecedores();
  }, []);

  const getFornecedorNome = (fornecedorId: number): string => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nome : `ID: ${fornecedorId}`;
  };

  const uniqueValues = useMemo(() => {
    const tipos = [...new Set(equipamentos.map(eq => eq.tipo))].sort();
    const marcas = [...new Set(equipamentos.map(eq => eq.marca))].sort();
    const estados = [...new Set(equipamentos.map(eq => eq.estado))].sort();
    
    return { tipos, marcas, estados };
  }, [equipamentos]);

  const filteredEquipamentos = useMemo(() => {
    return equipamentos.filter(equipamento => {
      const fornecedorNome = getFornecedorNome(equipamento.fornecedorId);
      return (
        (filters.id === '' || equipamento.id.toString() === filters.id) &&
        (filters.nome === '' || equipamento.nome.toLowerCase().startsWith(filters.nome.toLowerCase())) &&
        (filters.tipo === 'all' || equipamento.tipo === filters.tipo) &&
        (filters.marca === 'all' || equipamento.marca === filters.marca) &&
        (filters.numeroDeSerie === '' || equipamento.numeroDeSerie.toLowerCase().startsWith(filters.numeroDeSerie.toLowerCase())) &&
        (filters.estado === 'all' || equipamento.estado === filters.estado) &&
        (filters.fornecedor === '' || fornecedorNome.toLowerCase().includes(filters.fornecedor.toLowerCase()))
      );
    });
  }, [equipamentos, filters, fornecedores]);

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
      tipo: 'all',
      marca: 'all',
      numeroDeSerie: '',
      estado: 'all',
      fornecedor: ''
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
            <label className="block text-sm font-medium text-black">Tipo</label>
            <Select value={filters.tipo} onValueChange={(value) => handleFilterChange('tipo', value)}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 h-10">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueValues.tipos.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Marca</label>
            <Select value={filters.marca} onValueChange={(value) => handleFilterChange('marca', value)}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 h-10">
                <SelectValue placeholder="Todas as marcas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                {uniqueValues.marcas.map(marca => (
                  <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Número de Série</label>
            <Input
              placeholder="Filtrar por número de série..."
              value={filters.numeroDeSerie}
              onChange={(e) => handleFilterChange('numeroDeSerie', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Estado</label>
            <Select value={filters.estado} onValueChange={(value) => handleFilterChange('estado', value)}>
              <SelectTrigger className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 h-10">
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {uniqueValues.estados.map(estado => (
                  <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Fornecedor</label>
            <Input
              placeholder="Filtrar por fornecedor..."
              value={filters.fornecedor}
              onChange={(e) => handleFilterChange('fornecedor', e.target.value)}
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
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">Tipo</TableHead>
                <TableHead className="text-white font-semibold">Marca</TableHead>
                <TableHead className="text-white font-semibold">Modelo</TableHead>
                <TableHead className="text-white font-semibold">Número de Série</TableHead>
                <TableHead className="text-white font-semibold">Estado</TableHead>
                <TableHead className="text-white font-semibold">Fornecedor</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-lg">Nenhum equipamento encontrado</p>
                      <p className="text-slate-400 text-sm">Tente ajustar os filtros de pesquisa</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipamentos.map((equipamento, index) => {
                  if (!equipamento.id || equipamento.id === 0 || isNaN(equipamento.id)) {
                    console.error('ERRO: Equipamento com ID inválido encontrado:', {
                      equipamento,
                      id: equipamento.id,
                      index,
                      idType: typeof equipamento.id
                    });
                  }
                  
                  return (
                    <TableRow 
                      key={equipamento.id || `equipamento-${index}`} 
                      className={`hover:bg-gray-100 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                    <TableCell className="font-semibold text-slate-800">{equipamento.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{equipamento.nome}</TableCell>
                    <TableCell className="text-slate-600">{equipamento.tipo}</TableCell>
                    <TableCell className="text-slate-600">{equipamento.marca}</TableCell>
                    <TableCell className="text-slate-600">{equipamento.modelo}</TableCell>
                    <TableCell className="text-slate-600 font-mono text-sm">{equipamento.numeroDeSerie}</TableCell>
                    <TableCell>
                      <span className="text-slate-600">
                        {equipamento.estado}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">{getFornecedorNome(equipamento.fornecedorId)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ViewEquipamentoButton equipamento={equipamento} />
                        <EditEquipamentoButton 
                          equipamento={equipamento} 
                          onSuccess={onSuccess} 
                        />
                        <AssignObrasButton equipamento={equipamento} onSuccess={onSuccess} />
                        <DeleteEquipamentoButton equipamentoId={equipamento.id} onSuccess={onSuccess} />
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
