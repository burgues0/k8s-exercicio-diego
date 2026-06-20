"use client";
import { useState } from "react";
import { ObrasService } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface ObraEnderecoFormProps {
  obraId: string;
  initialData?: any;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ObraEnderecoForm({ obraId, initialData, onSaved, onCancel }: ObraEnderecoFormProps) {
  const [form, setForm] = useState<any>(initialData || {
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Remove propriedades indesejadas e mapeia para nomes do backend
      const { id, createdAt, updatedAt, logradouro, ...rest } = form;
      const payload = {
        rua: form.logradouro || form.rua || '',
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
      };
      if (initialData) {
        await ObrasService.updateEndereco(obraId, payload);
      } else {
        await ObrasService.createEndereco(obraId, payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar endereço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded">
      <div className="grid grid-cols-2 gap-2">
        <input className="bg-white border rounded p-2" name="rua" placeholder="Rua" value={form.rua} onChange={handleChange} required />
        <input className="bg-white border rounded p-2" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />
        <input className="bg-white border rounded p-2" name="complemento" placeholder="Complemento" value={form.complemento || ''} onChange={handleChange} />
        <input className="bg-white border rounded p-2" name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required />
        <input className="bg-white border rounded p-2" name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />
        <input className="bg-white border rounded p-2" name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} required />
        <input className="bg-white border rounded p-2" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} required />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
