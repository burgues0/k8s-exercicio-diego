"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import ViewRelatoriosFiscalizacaoButton from "./viewRelatoriosFiscalizacaoButton";
import CreateRelatorioFiscalizacaoButton from "./createRelatorioFiscalizacaoButton";
import DeleteRelatoriosFiscalizacaoButton from "./deleteRelatoriosFiscalizacaoButton";
import { Fiscalizacao } from "@/types/fiscalizacoes";
import { useState } from "react";

interface RelatoriosMenuButtonProps {
  fiscalizacao: Fiscalizacao;
  onSuccess: () => void;
}

export default function RelatoriosMenuButton({ fiscalizacao, onSuccess }: RelatoriosMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Relatórios</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" style={{ borderRadius: '0.75rem' }}>
        <DialogHeader className="text-white p-4 m-0" style={{ background: '#F1860C', borderRadius: '0.75rem 0.75rem 0 0' }}>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <FileText className="w-5 h-5" />
            Relatórios da Fiscalização
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 p-4">
          <ViewRelatoriosFiscalizacaoButton fiscalizacao={fiscalizacao} />
          
          <CreateRelatorioFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={handleSuccess} />
          
          <DeleteRelatoriosFiscalizacaoButton fiscalizacao={fiscalizacao} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
