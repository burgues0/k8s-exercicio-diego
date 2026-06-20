"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ObrasService } from "@/lib/api";
import ObraForm, { formSchema } from "@/components/obras/obraForm";
import { Obra } from "@/types/obras";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraEdit() {
  const router = useRouter();
  const params = useParams();
  const obraId = params?.id as string;
  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchObra() {
      setLoading(true);
      setError(null);
      try {
        const data = await ObrasService.getById(obraId);
        setObra(data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar obra.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchObra();
  }, [obraId]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    setError(null);
    try {
      await ObrasService.update(obraId, data);
      router.push("/obras");
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar obra.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Carregando obra...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!obra) return <p>Obra não encontrada.</p>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ObraForm initialData={obra} onSubmit={handleSubmit} isLoading={isSaving} />
          <Link href={`/obras/${obraId}`}> <Button variant="outline" className="mt-4">Cancelar</Button> </Link>
        </CardContent>
      </Card>
    </div>
  );
}
