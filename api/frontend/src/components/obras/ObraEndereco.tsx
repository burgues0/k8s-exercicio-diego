"use client";

import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraEndereco() {
  const params = useParams();
  const obraId = params?.id as string;
  const [endereco, setEndereco] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEndereco() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getEnderecoByObra(obraId);
        setEndereco(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar endereço.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchEndereco();
  }, [obraId]);

  if (loading) return <p>Carregando endereço...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Endereço da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {endereco ? (
            <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(endereco, null, 2)}</pre>
          ) : (
            <span>-</span>
          )}
          <Link href={`/obras/${obraId}`}> <Button variant="outline" className="mt-4">Voltar</Button> </Link>
        </CardContent>
      </Card>
    </div>
  );
}
