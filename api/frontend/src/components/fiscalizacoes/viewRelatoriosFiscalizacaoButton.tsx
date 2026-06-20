"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fiscalizacoesService } from "@/services/fiscalizacoesService";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { Relatorio } from "@/types/relatorios";
import { ScrollText, Eye } from "lucide-react";

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

// Função para extrair data de um objeto relatório (igual ao usada na tabela principal)
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

interface ViewRelatoriosFiscalizacaoButtonProps {
  fiscalizacao: Fiscalizacao;
}

export default function ViewRelatoriosFiscalizacaoButton({ fiscalizacao }: ViewRelatoriosFiscalizacaoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRelatorios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fiscalizacoesService.getRelatoriosFiscalizacao(fiscalizacao.id);
      setRelatorios(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  }, [fiscalizacao.id]);

  useEffect(() => {
    if (isOpen) {
      loadRelatorios();
    }
  }, [isOpen, loadRelatorios]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-start gap-2 p-3 h-auto">
          <Eye className="w-4 h-4" />
          <span>Visualizar Relatórios</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            Relatórios da Fiscalização
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="p-6">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-3 text-gray-600">Carregando relatórios...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Relatórios */}
            {!loading && !error && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {relatorios.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ScrollText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">Nenhum relatório encontrado</p>
                    <p className="text-slate-400 text-sm">Esta fiscalização ainda não possui relatórios</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-lg font-semibold">Relatórios ({relatorios.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow style={{ background: '#B9B9B9' }} className="hover:bg-[#A5A5A5]">
                            <TableHead className="text-white font-semibold">ID</TableHead>
                            <TableHead className="text-white font-semibold">Título</TableHead>
                            <TableHead className="text-white font-semibold">Data de Criação</TableHead>
                            <TableHead className="text-white font-semibold">Conteúdo</TableHead>
                            <TableHead className="text-white font-semibold">ID Fiscalização</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatorios.map((relatorio, index) => (
                            <TableRow 
                              key={relatorio.id} 
                              className={`hover:bg-gray-100 transition-colors duration-150 ${
                                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                              }`}
                            >
                              <TableCell className="font-semibold text-slate-800">{relatorio.id}</TableCell>
                              <TableCell className="font-medium text-slate-700">{relatorio.titulo}</TableCell>
                              <TableCell className="text-slate-600">{formatDate(getDateFromRelatorio(relatorio))}</TableCell>
                              <TableCell className="text-slate-600">
                                <div className="whitespace-pre-wrap break-words">
                                  {relatorio.conteudo || 'Sem conteúdo'}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-600">{relatorio.fiscalizacaoId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
