import React, { useState } from 'react';
import { ObrasService } from '../../lib/api';
import { Button } from '@/components/ui/button';

interface ObraDiarioCreateProps {
  obraId: string;
  onCreated?: () => void;
  onCancel?: () => void;
}

const ObraDiarioCreate: React.FC<ObraDiarioCreateProps> = ({ obraId, onCreated, onCancel }) => {
  const [data, setData] = useState('');
  const [clima, setClima] = useState('');
  const [atividadesExecutadas, setAtividadesExecutadas] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Garante que obraId é número
      const obraIdInt = typeof obraId === 'string' ? parseInt(obraId, 10) : obraId;
      if (!obraIdInt || isNaN(obraIdInt)) {
        setError('ID da obra inválido.');
        setLoading(false);
        return;
      }
      await ObrasService.createDiario(Number(obraIdInt), {
        data,
        clima: clima || undefined,
        atividadesExecutadas: atividadesExecutadas || undefined,
        observacoes: observacoes || undefined,
        obraId: Number(obraIdInt),
      });
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded shadow p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Novo Diário de Obra</h2>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Data *</label>
        <input type="date" className="border rounded p-2 w-full bg-white" value={data} onChange={e => setData(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Clima</label>
        <input type="text" className="border rounded p-2 w-full bg-white" value={clima} onChange={e => setClima(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Atividades Executadas</label>
        <textarea className="border rounded p-2 w-full bg-white" value={atividadesExecutadas} onChange={e => setAtividadesExecutadas(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Observações</label>
        <textarea className="border rounded p-2 w-full bg-white" value={observacoes} onChange={e => setObservacoes(e.target.value)} />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2 mt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
};

export default ObraDiarioCreate;
