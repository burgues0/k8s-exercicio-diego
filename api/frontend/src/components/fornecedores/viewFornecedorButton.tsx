"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Fornecedor } from "@/types/fornecedores";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface ViewFornecedorButtonProps {
  fornecedor: Fornecedor;
}

export default function ViewFornecedorButton({ fornecedor }: ViewFornecedorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white shadow-2xl border-0 p-0" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="text-xl font-bold">Detalhes do Fornecedor</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-110px)] overflow-y-auto">
          <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">ID</label>
                <p className="text-sm text-gray-600">{fornecedor.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-2">
                  <Badge 
                    variant={fornecedor.ativo ? "default" : "default"}
                    className={fornecedor.ativo ? "bg-white text-black border border-gray-300 hover:bg-gray-50" : ""}
                  >
                    {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <p className="text-sm text-gray-600">{fornecedor.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium">CNPJ</label>
                <p className="text-sm text-gray-600 font-mono">{fornecedor.cnpj}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-gray-600">{fornecedor.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <p className="text-sm text-gray-600">{fornecedor.telefone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium">Endereço</label>
                <p className="text-sm text-gray-600">{fornecedor.endereco}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data de Criação</label>
                <p className="text-sm text-gray-600">{formatDateTime(fornecedor.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Última Atualização</label>
                <p className="text-sm text-gray-600">{formatDateTime(fornecedor.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
