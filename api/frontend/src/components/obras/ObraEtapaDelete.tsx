"use client";
import { ObrasService } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ObraEtapaDeleteProps {
  obraId: string;
  etapaId: string;
  onDeleted?: () => void;
  onCancel?: () => void;
}

export default function ObraEtapaDelete({ obraId, etapaId, onDeleted, onCancel }: ObraEtapaDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await ObrasService.deleteEtapa(obraId, etapaId);
      if (onDeleted) onDeleted();
    } catch (err: any) {
      setError(err.message || "Erro ao remover etapa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="font-bold text-lg mb-2">Remover Etapa</h2>
      {error && <p className="text-red-500">{error}</p>}
      <p>Tem certeza que deseja remover esta etapa?</p>
      <div className="flex gap-2 mt-4">
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Removendo..." : "Remover"}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
