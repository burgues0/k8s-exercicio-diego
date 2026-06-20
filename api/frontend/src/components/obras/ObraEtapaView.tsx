"use client";
import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ObraEtapaViewProps {
  obraId: string;
  etapaId: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBack?: () => void;
}

export default function ObraEtapaView({ obraId, etapaId, onEdit, onDelete, onBack }: ObraEtapaViewProps) {
  const [etapa, setEtapa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEtapa() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getEtapaById(obraId, etapaId);
        setEtapa(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar etapa.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId && etapaId) fetchEtapa();
  }, [obraId, etapaId]);

  if (loading) return <div>Carregando etapa...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!etapa) return <div>Etapa não encontrada.</div>;

  return (
    <div className="border rounded p-4 bg-white max-w-lg mx-auto">
      <button className="mb-2 text-blue-600" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-lg font-semibold mb-2">Detalhes da Etapa</h2>
      <div className="mb-2"><b>Nome:</b> {etapa.nome}</div>
      <div className="mb-2"><b>Status:</b> {etapa.status}</div>
      <div className="mb-2"><b>Descrição:</b> {etapa.descricao || '-'}</div>
      <div className="mb-2"><b>Início previsto:</b> {etapa.dataInicioPrevista ? etapa.dataInicioPrevista.substring(0, 10) : '-'}</div>
      <div className="mb-2"><b>Fim previsto:</b> {etapa.dataFimPrevista ? etapa.dataFimPrevista.substring(0, 10) : '-'}</div>
      <div className="mb-2"><b>Início real:</b> {etapa.dataInicioReal ? etapa.dataInicioReal.substring(0, 10) : '-'}</div>
      <div className="mb-2"><b>Fim real:</b> {etapa.dataFimReal ? etapa.dataFimReal.substring(0, 10) : '-'}</div>
      <div className="flex gap-2 mt-4">
        {onEdit && <Button className="btn btn-secondary" onClick={() => onEdit(etapaId)}>Editar</Button>}
        {onDelete && <Button className="btn btn-danger" onClick={() => onDelete(etapaId)}>Excluir</Button>}
      </div>
    </div>
  );
}
