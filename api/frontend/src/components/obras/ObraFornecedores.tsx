"use client";

import { useEffect, useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraFornecedores() {
  const params = useParams();
  const obraId = params?.id as string;
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFornecedores() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getFornecedores(obraId);
        setFornecedores(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar fornecedores.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchFornecedores();
  }, [obraId]);

  if (loading) return <p>Carregando fornecedores...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Fornecedores da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {fornecedores.length > 0 ? (
            <ul className="list-disc ml-6">
              {fornecedores.map((f: any) => (
                <li key={f.id}>{f.nome || f.razao_social || f.id}</li>
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
