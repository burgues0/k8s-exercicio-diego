"use client";

import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraEquipamentos() {
  const params = useParams();
  const obraId = params?.id as string;
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEquipamentos() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getEquipamentos(obraId);
        setEquipamentos(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar equipamentos.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchEquipamentos();
  }, [obraId]);

  if (loading) return <p>Carregando equipamentos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Equipamentos da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {equipamentos.length > 0 ? (
            <ul className="list-disc ml-6">
              {equipamentos.map((e: any) => (
                <li key={e.id}>{e.nome || e.tipo || e.id}</li>
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
