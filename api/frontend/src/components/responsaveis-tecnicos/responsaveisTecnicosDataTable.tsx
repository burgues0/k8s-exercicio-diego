"use client";

import { useState, useMemo } from "react";
import { ResponsavelTecnico } from "@/types/responsaveis-tecnicos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import DeleteResponsavelTecnicoButton from "@/components/responsaveis-tecnicos/deleteResponsavelTecnicoButton";
import EditResponsavelTecnicoButton from "@/components/responsaveis-tecnicos/editResponsavelTecnicoButton";
import ViewResponsavelTecnicoButton from "@/components/responsaveis-tecnicos/viewResponsavelTecnicoButton";
import AssignObrasResponsavelTecnicoButton from "@/components/responsaveis-tecnicos/assignObrasResponsavelTecnicoButton";

interface ResponsaveisTecnicosDataTableProps {
  responsaveis: ResponsavelTecnico[];
  onSuccess: () => void;
}

export default function ResponsaveisTecnicosDataTable({ responsaveis, onSuccess }: ResponsaveisTecnicosDataTableProps) {
  const [filters, setFilters] = useState({
    id: '',
    nome: '',
    cpf: '',
    registro_profissional: '',
    especialidade: '',
    ativo: 'all'
  });

  const filteredResponsaveis = useMemo(() => {
    if (!Array.isArray(responsaveis)) {
      return [];
    }

    return responsaveis.filter(responsavel => {
      if (!responsavel || typeof responsavel !== 'object') {
        return false;
      }

      // Filtro por ID
      const matchesId = !filters.id || responsavel.id?.toString() === filters.id;
      
      // Filtro por nome
      const matchesNome = !filters.nome || 
        (responsavel.nome && responsavel.nome.toLowerCase().includes(filters.nome.toLowerCase()));

      // Filtro por CPF
      const matchesCpf = !filters.cpf || 
        (responsavel.cpf && responsavel.cpf.toLowerCase().includes(filters.cpf.toLowerCase()));

      // Filtro por registro profissional
      const matchesRegistro = !filters.registro_profissional || 
        (responsavel.registro_profissional && responsavel.registro_profissional.toLowerCase().includes(filters.registro_profissional.toLowerCase()));

      // Filtro por especialidade
      const matchesEspecialidade = !filters.especialidade || 
        (responsavel.especialidade && responsavel.especialidade.toLowerCase().includes(filters.especialidade.toLowerCase()));

      // Filtro por status ativo
      let matchesAtivo = true;
      if (filters.ativo && filters.ativo !== 'all') {
        const responsavelAtivo = responsavel.ativo?.toString().trim().toLowerCase() || '';
        const filterAtivo = filters.ativo.toString().trim().toLowerCase();
        
        const statusMapping: { [key: string]: string[] } = {
          'true': ['true', 'ativo', '1'],
          'false': ['false', 'inativo', '0']
        };
        
        const possibleValues = statusMapping[filterAtivo] || [filterAtivo];
        matchesAtivo = possibleValues.includes(responsavelAtivo);
      }

      return matchesId && matchesNome && matchesCpf && matchesRegistro && matchesEspecialidade && matchesAtivo;
    });
  }, [responsaveis, filters]);

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
      cpf: '',
      registro_profissional: '',
      especialidade: '',
      ativo: 'all'
    });
  };

  const getStatusBadge = (ativo: boolean) => {
    return (
      <Badge 
        variant="default"
        className={ativo ? "bg-white text-black border border-gray-300 hover:bg-gray-50" : ""}
      >
        {ativo ? 'Ativo' : 'Inativo'}
      </Badge>
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
              Nome
            </label>
            <Input
              placeholder="Digite o nome..."
              value={filters.nome}
              onChange={(e) => handleFilterChange('nome', e.target.value)}
              className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              CPF
            </label>
            <Input
              placeholder="Digite o CPF..."
              value={filters.cpf}
              onChange={(e) => handleFilterChange('cpf', e.target.value)}
              className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Registro Profissional
            </label>
            <Input
              placeholder="Digite o registro..."
              value={filters.registro_profissional}
              onChange={(e) => handleFilterChange('registro_profissional', e.target.value)}
              className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Especialidade
            </label>
            <Input
              placeholder="Digite a especialidade..."
              value={filters.especialidade}
              onChange={(e) => handleFilterChange('especialidade', e.target.value)}
              className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">
              Status
            </label>
            <Select value={filters.ativo} onValueChange={(value) => handleFilterChange('ativo', value)}>
              <SelectTrigger className="border-slate-300 focus:border-gray-600 focus:ring-gray-600/20 bg-white h-10">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
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
                <TableHead className="text-white font-semibold">CPF</TableHead>
                <TableHead className="text-white font-semibold">Registro Profissional</TableHead>
                <TableHead className="text-white font-semibold">Especialidade</TableHead>
                <TableHead className="text-white font-semibold min-w-[120px]">Status</TableHead>
                <TableHead className="text-white font-semibold text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponsaveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhum responsável técnico encontrado</p>
                      <p className="text-slate-400 text-sm">Ajuste os filtros ou crie um novo responsável técnico</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredResponsaveis.map((responsavel, index) => (
                  <TableRow 
                    key={responsavel.id} 
                    className={`hover:bg-gray-100 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <TableCell className="font-semibold text-slate-800">{responsavel.id}</TableCell>
                    <TableCell className="font-medium text-slate-700">{responsavel.nome}</TableCell>
                    <TableCell className="text-slate-600">{responsavel.cpf}</TableCell>
                    <TableCell className="text-slate-600">{responsavel.registro_profissional}</TableCell>
                    <TableCell className="text-slate-600">{responsavel.especialidade}</TableCell>
                    <TableCell className="min-w-[120px]">{getStatusBadge(responsavel.ativo)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <ViewResponsavelTecnicoButton responsavel={responsavel} />
                        <EditResponsavelTecnicoButton responsavel={responsavel} onSuccess={onSuccess} />
                        <AssignObrasResponsavelTecnicoButton responsavel={responsavel} onSuccess={onSuccess} />
                        <DeleteResponsavelTecnicoButton responsavel={responsavel} onSuccess={onSuccess} />
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
