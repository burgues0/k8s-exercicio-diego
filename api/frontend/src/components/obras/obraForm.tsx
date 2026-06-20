"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Obra } from "@/types/obras";

const optionalNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  },
  z.number().optional()
);

const nullableNumber = z.preprocess(
  (val) => {
    if (val === '' || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  },
  z.number().nullable()
);

export const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres.").optional(),
  status: z.string(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)."),
  data_conclusao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD).").nullable().optional(),
  orcamento_total: z.preprocess(
    (val) => Number(val),
    z.number().positive("Orçamento total deve ser um número positivo.")
  ),
  gastos_atualizados: optionalNumber.refine(val => val === undefined || val >= 0, "Gastos atualizados não podem ser negativos."),
  percentual_concluido: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Percentual não pode ser negativo.").max(100, "Percentual não pode ser maior que 100.")
  ),
  latitude: nullableNumber.refine(val => val === null || (val >= -90 && val <= 90), "Latitude inválida (-90 a 90)."),
  longitude: nullableNumber.refine(val => val === null || (val >= -180 && val <= 180), "Longitude inválida (-180 a 180)."),
});

export type FormData = z.infer<typeof formSchema>;

interface ObraFormProps {
  initialData?: Obra;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ObraForm({ initialData, onSubmit, isLoading }: ObraFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      data_inicio: initialData.data_inicio.split('T')[0],
      data_conclusao: initialData.data_conclusao ? initialData.data_conclusao.split('T')[0] : '',
      gastos_atualizados: initialData.gastos_atualizados ?? undefined,
      percentual_concluido: initialData.percentual_concluido ?? 0,
      latitude: initialData.latitude ?? null,
      longitude: initialData.longitude ?? null,
    } as any : {
      nome: '',
      descricao: '',
      status: 'Planejada',
      data_inicio: '',
      data_conclusao: '',
      orcamento_total: 0,
      gastos_atualizados: undefined,
      percentual_concluido: 0,
      latitude: null,
      longitude: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <FormField
          control={form.control as any}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Obra</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição detalhada da obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="Planejada">Planejada</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Paralisada">Paralisada</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="data_inicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Início</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="data_conclusao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Conclusão</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="orcamento_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento Total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="gastos_atualizados"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gastos Atualizados</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="percentual_concluido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentual Concluído (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Obra"}
        </Button>
      </form>
    </Form>
  );
}