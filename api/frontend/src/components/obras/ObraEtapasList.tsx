"use client";
import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraEtapasList() {
  const params = useParams();
  const obraId = params?.id as string;
  const [etapas, setEtapas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEtapas() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getEtapas(obraId);
        setEtapas(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar etapas.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchEtapas();
  }, [obraId]);

  if (loading) return <p>Carregando etapas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">Etapas da Obra</h2>
        <Link href={`/obras/${obraId}/etapas/create`}><Button size="sm">Nova Etapa</Button></Link>
      </div>
      {etapas.length > 0 ? (
        <ul className="list-disc ml-6">
          {etapas.map((etapa: any) => (
            <li key={etapa.id}>
              <Link href={`/obras/${obraId}/etapas/${etapa.id}`}>{etapa.nome || etapa.id}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <span>-</span>
      )}
    </div>
  );
}
