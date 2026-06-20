"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Obra } from "@/types/obras";
import { ObrasService } from "@/lib/api";
import ObrasDataTable from "@/components/obras/obrasDataTable";

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ObrasService.getAll();
      setObras(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar obras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObras();
  }, [fetchObras]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Obras</h1>
        <Link href="/obras/create">
          <Button>Nova Obra</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Carregando obras...</p>}
          {error && <p className="text-red-500">Erro: {error}</p>}
          {!loading && !error && <ObrasDataTable obras={obras} onDeleteSuccess={fetchObras} />}
        </CardContent>
      </Card>
    </div>
  );
}