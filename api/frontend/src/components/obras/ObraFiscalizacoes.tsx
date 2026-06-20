"use client";

import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraFiscalizacoes() {
  const params = useParams();
  const obraId = params?.id as string;
  const [fiscalizacoes, setFiscalizacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiscalizacoes() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getFiscalizacoes(obraId);
        setFiscalizacoes(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar fiscalizações.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchFiscalizacoes();
  }, [obraId]);

  if (loading) return <p>Carregando fiscalizações...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Fiscalizações da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {fiscalizacoes.length > 0 ? (
            <ul className="list-disc ml-6">
              {fiscalizacoes.map((f: any) => (
                <li key={f.id}>{f.tipo || f.id}</li>
              ))}
            </ul>
          ) : (
            <span>-</span>
          )}
          <Link href={`/obras/${obraId}`}> <Button variant="outline" className="mt-4">Voltar</Button> </Link>
        </CardContent>
      </Card>
    </div>
  );
}
