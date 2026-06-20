import React, { useState } from 'react';
import { ObrasService } from '../../lib/api';

interface ObraDiarioDeleteProps {
  obraId: string;
  diarioId: string;
  onDeleted?: () => void;
  onCancel?: () => void;
}

const ObraDiarioDelete: React.FC<ObraDiarioDeleteProps> = ({ obraId, diarioId, onDeleted, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const obraIdInt = typeof obraId === 'string' ? parseInt(obraId, 10) : obraId;
      await ObrasService.deleteDiario(obraIdInt, diarioId);
      if (onDeleted) onDeleted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 bg-white">
      <h2 className="text-lg font-semibold mb-2">Excluir Diário de Obra</h2>
      <p>Tem certeza que deseja excluir este diário?</p>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>Excluir</button>
        {onCancel && <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </div>
  );
};

export default ObraDiarioDelete;
