"use client";

import { useState } from "react";
import { ObrasService } from "@/lib/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ObraEtapaCreateProps {
  obraId: string;
  onCreated?: () => void;
  onCancel?: () => void;
}

const statusOptions = [
  { value: "Nao iniciada", label: "Não iniciada" },
  { value: "Em andamento", label: "Em andamento" },
  { value: "Concluída", label: "Concluída" },
  { value: "Atrasada", label: "Atrasada" },
];

export default function ObraEtapaCreate({ obraId, onCreated, onCancel }: ObraEtapaCreateProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicioPrevista, setDataInicioPrevista] = useState("");
  const [dataFimPrevista, setDataFimPrevista] = useState("");
  const [status, setStatus] = useState("Nao iniciada");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!nome.trim()) return "Nome é obrigatório.";
    if (!dataInicioPrevista) return "Data de início prevista é obrigatória.";
    if (!dataFimPrevista) return "Data de fim prevista é obrigatória.";
    if (new Date(dataFimPrevista) < new Date(dataInicioPrevista)) return "Data de fim não pode ser anterior à de início.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await ObrasService.createEtapa(obraId, {
        nome,
        descricao,
        dataInicioPrevista,
        dataFimPrevista,
        status,
      });
      setSuccess("Etapa criada com sucesso!");
      setNome("");
      setDescricao("");
      setDataInicioPrevista("");
      setDataFimPrevista("");
      setStatus("Nao iniciada");
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message || "Erro ao criar etapa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="font-bold text-xl mb-2">Nova Etapa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Nome *</label>
          <input className="border p-2 rounded w-full" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Status *</label>
          <select className="border p-2 rounded w-full" value={status} onChange={e => setStatus(e.target.value)}>
            {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Data início prevista *</label>
          <input type="date" className="border p-2 rounded w-full" value={dataInicioPrevista} onChange={e => setDataInicioPrevista(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Data fim prevista *</label>
          <input type="date" className="border p-2 rounded w-full" value={dataFimPrevista} onChange={e => setDataFimPrevista(e.target.value)} required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Descrição</label>
          <textarea className="border p-2 rounded w-full" value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} />
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
