import React, { useEffect, useState } from 'react';
import { ObrasService } from '../../lib/api';
import { Button } from '@/components/ui/button';

const statusOptions = [
  'Nao iniciada',
  'Em andamento',
  'Concluída',
  'Atrasada',
];

interface ObraEtapaEditDashboardProps {
  obraId: string;
  etapaId: string;
  onUpdated?: () => void;
  onCancel?: () => void;
}

const ObraEtapaEditDashboard: React.FC<ObraEtapaEditDashboardProps> = ({ obraId, etapaId, onUpdated, onCancel }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicioPrevista, setDataInicioPrevista] = useState('');
  const [dataFimPrevista, setDataFimPrevista] = useState('');
  const [dataInicioReal, setDataInicioReal] = useState('');
  const [dataFimReal, setDataFimReal] = useState('');
  const [status, setStatus] = useState('Nao iniciada');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ObrasService.getEtapaById(obraId, etapaId)
      .then((d) => {
        setNome(d.nome || '');
        setDescricao(d.descricao || '');
        setDataInicioPrevista(d.dataInicioPrevista ? d.dataInicioPrevista.substring(0,10) : '');
        setDataFimPrevista(d.dataFimPrevista ? d.dataFimPrevista.substring(0,10) : '');
        setDataInicioReal(d.dataInicioReal ? d.dataInicioReal.substring(0,10) : '');
        setDataFimReal(d.dataFimReal ? d.dataFimReal.substring(0,10) : '');
        setStatus(d.status || 'Nao iniciada');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [obraId, etapaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ObrasService.updateEtapa(obraId, etapaId, {
        nome,
        descricao: descricao || undefined,
        dataInicioPrevista,
        dataFimPrevista,
        dataInicioReal: dataInicioReal || undefined,
        dataFimReal: dataFimReal || undefined,
        status,
        obraId: typeof obraId === 'string' ? parseInt(obraId, 10) : obraId,
      });
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <form className="bg-white rounded shadow p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Editar Etapa</h2>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Nome *</label>
        <input type="text" className="border rounded p-2 w-full bg-white" value={nome} onChange={e => setNome(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea className="border rounded p-2 w-full bg-white" value={descricao} onChange={e => setDescricao(e.target.value)} />
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Início Previsto *</label>
          <input type="date" className="border rounded p-2 w-full bg-white" value={dataInicioPrevista} onChange={e => setDataInicioPrevista(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fim Previsto *</label>
          <input type="date" className="border rounded p-2 w-full bg-white" value={dataFimPrevista} onChange={e => setDataFimPrevista(e.target.value)} required />
        </div>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Início Real</label>
          <input type="date" className="border rounded p-2 w-full bg-white" value={dataInicioReal} onChange={e => setDataInicioReal(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fim Real</label>
          <input type="date" className="border rounded p-2 w-full bg-white" value={dataFimReal} onChange={e => setDataFimReal(e.target.value)} />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Status *</label>
        <select className="border rounded p-2 w-full bg-white" value={status} onChange={e => setStatus(e.target.value)} required>
          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
};

export default ObraEtapaEditDashboard;
