"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { Clock, ClipboardCheck } from "lucide-react";

const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return 'Não disponível';
  }
  
  try {
    const dateOnly = dateString.split('T')[0];
    const date = new Date(dateOnly + 'T00:00:00');
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
};

interface RecentFiscalizacoesButtonProps {
  onSuccess?: () => void;
}

export default function RecentFiscalizacoesButton({ onSuccess }: RecentFiscalizacoesButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fiscalizacoes, setFiscalizacoes] = useState<Fiscalizacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiscalizacoesRecentes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fiscalizacoesService.getFiscalizacoesRecentes();
      setFiscalizacoes(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar fiscalizações recentes");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadFiscalizacoesRecentes();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'planejada': { label: 'Planejada', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'em_andamento': { label: 'Em Andamento', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'concluida': { label: 'Concluída', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
        >
          <Clock className="mr-2 h-4 w-4" />
          Fiscalizações Recentes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Fiscalizações Recentes (10 mais recentes)
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-600">Carregando fiscalizações recentes...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Fiscalizações */}
            {!loading && !error && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {fiscalizacoes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ClipboardCheck className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Nenhuma fiscalização encontrada</p>
                    <p className="text-slate-400 text-sm">Não há fiscalizações recentes no sistema</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ background: '#B9B9B9' }} className="hover:bg-[#A5A5A5]">
                          <TableHead className="text-white font-semibold">ID</TableHead>
                          <TableHead className="text-white font-semibold">Título</TableHead>
                          <TableHead className="text-white font-semibold">Data Início</TableHead>
                          <TableHead className="text-white font-semibold">Data Fim</TableHead>
                          <TableHead className="text-white font-semibold">Status</TableHead>
                          <TableHead className="text-white font-semibold">ID Responsável</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fiscalizacoes.map((fiscalizacao, index) => (
                          <TableRow 
                            key={fiscalizacao.id} 
                            className={`hover:bg-gray-100 transition-colors duration-150 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                            }`}
                          >
                            <TableCell className="font-semibold text-slate-800">{fiscalizacao.id}</TableCell>
                            <TableCell className="font-medium text-slate-700 max-w-xs">
                              <div className="truncate" title={fiscalizacao.titulo}>
                                {fiscalizacao.titulo}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">{formatDate(fiscalizacao.data_inicio)}</TableCell>
                            <TableCell className="text-slate-600">{formatDate(fiscalizacao.data_fim)}</TableCell>
                            <TableCell>{getStatusBadge(fiscalizacao.status)}</TableCell>
                            <TableCell className="text-slate-600">{fiscalizacao.responsavelTecnicoId || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
