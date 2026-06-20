"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ObrasService } from "@/lib/api";
import ObraForm, { formSchema } from "@/components/obras/obraForm";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ObraCreate() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      await ObrasService.create(data);
      router.push("/obras");
    } catch (err: any) {
      setError(err.message || "Erro ao criar obra.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Obra</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <ObraForm onSubmit={handleSubmit} isLoading={isLoading} />
          <Link href="/obras"> <Button variant="outline" className="mt-4">Cancelar</Button> </Link>
        </CardContent>
      </Card>
    </div>
  );
}
