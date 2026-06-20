"use client";

import { useState, useMemo } from "react";
import { Material } from "@/types/materiais";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import DeleteMaterialButton from "@/components/materiais/deleteMaterialButton";
import EditMaterialButton from "@/components/materiais/editMaterialButton";
import ViewMaterialButton from "@/components/materiais/viewMaterialButton";

interface MateriaisDataTableProps {
  materiais: Material[];
  onSuccess: () => void;
}

export default function MateriaisDataTable({ materiais, onSuccess }: MateriaisDataTableProps) {
  const [filters, setFilters] = useState({
    id: '',
    codigo: '',
    nome: '',
    fabricante: '',
    modelo: ''
  });

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0,00' : numPrice.toFixed(2).replace('.', ',');
  };

  const filteredMateriais = useMemo(() => {
    return materiais.filter(material => {
      return (
        (filters.id === '' || material.id.toString() === filters.id) &&
        (filters.codigo === '' || material.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) &&
        (filters.nome === '' || material.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
        (filters.fabricante === '' || (material.fabricante && material.fabricante.toLowerCase().includes(filters.fabricante.toLowerCase()))) &&
        (filters.modelo === '' || (material.modelo && material.modelo.toLowerCase().includes(filters.modelo.toLowerCase())))
      );
    });
  }, [materiais, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      id: '',
      codigo: '',
      nome: '',
      fabricante: '',
      modelo: ''
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
            <label className="block text-sm font-medium text-black">Código</label>
            <Input
              placeholder="Filtrar por código..."
              value={filters.codigo}
              onChange={(e) => handleFilterChange('codigo', e.target.value)}
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
            <label className="block text-sm font-medium text-black">Fabricante</label>
            <Input
              placeholder="Filtrar por fabricante..."
              value={filters.fabricante}
              onChange={(e) => handleFilterChange('fabricante', e.target.value)}
              className="border-slate-300 focus:border-[#F1860C] focus:ring-[#F1860C]/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Modelo</label>
            <Input
              placeholder="Filtrar por modelo..."
              value={filters.modelo}
              onChange={(e) => handleFilterChange('modelo', e.target.value)}
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
                <TableHead className="text-white font-semibold">Código</TableHead>
                <TableHead className="text-white font-semibold">Nome</TableHead>
                <TableHead className="text-white font-semibold">Fabricante</TableHead>
                <TableHead className="text-white font-semibold">Modelo</TableHead>
                <TableHead className="text-white font-semibold">Unidade</TableHead>
                <TableHead className="text-white font-semibold">Preço Unit.</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMateriais.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg">Nenhum material encontrado</p>
                      <p className="text-slate-400 text-sm">Tente ajustar os filtros de pesquisa</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMateriais.map((material, index) => {
                  if (!material.id || material.id === 0 || isNaN(material.id)) {
                    console.error('ERRO: Material com ID inválido encontrado:', {
                      material,
                      id: material.id,
                      index,
                      idType: typeof material.id
                    });
                  }
                  
                  return (
                    <TableRow 
                      key={material.id || `material-${index}`} 
                      className={`hover:bg-gray-100 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                    <TableCell className="font-semibold text-slate-800">{material.id}</TableCell>
                    <TableCell className="font-medium text-slate-700 font-mono text-sm">{material.codigo}</TableCell>
                    <TableCell className="text-slate-600">{material.nome}</TableCell>
                    <TableCell className="text-slate-600">{material.fabricante || '-'}</TableCell>
                    <TableCell className="text-slate-600">{material.modelo || '-'}</TableCell>
                    <TableCell className="text-slate-600">{material.unidadeMedida || '-'}</TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      R$ {formatPrice(material.precoUnitario)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ViewMaterialButton material={material} />
                        <EditMaterialButton 
                          material={material} 
                          onSuccess={onSuccess} 
                        />
                        <DeleteMaterialButton materialId={material.id} onSuccess={onSuccess} />
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
