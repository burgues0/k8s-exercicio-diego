"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateObraDto } from "@/types/obras";
import { ObrasService } from "@/lib/api";
import ObraForm, { formSchema } from "@/components/obras/obraForm";
import { z } from "zod";

export default function CreateObraPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await ObrasService.create(data as CreateObraDto);
      router.push("/obras");
    } catch (err: any) {
      setError(err.message || "Erro ao criar obra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Nova Obra</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados da Nova Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ObraForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}