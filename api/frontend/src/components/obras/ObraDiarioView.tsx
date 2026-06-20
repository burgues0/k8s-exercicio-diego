import React, { useEffect, useState } from 'react';
import { ObrasService } from '../../lib/api';

interface ObraDiarioViewProps {
  obraId: string;
  diarioId: string;
  onEdit?: (diarioId: string) => void;
  onDelete?: (diarioId: string) => void;
  onBack?: () => void;
}

const ObraDiarioView: React.FC<ObraDiarioViewProps> = ({ obraId, diarioId, onEdit, onDelete, onBack }) => {
  const [diario, setDiario] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ObrasService.getDiarioById(obraId, diarioId)
      .then(setDiario)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [obraId, diarioId]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!diario) return null;

  return (
    <div className="border rounded p-4 bg-white max-w-lg mx-auto">
      <button className="mb-2 text-blue-600" onClick={onBack}>&larr; Voltar</button>
      <h2 className="text-lg font-semibold mb-2">Detalhes do Diário</h2>
      <div className="mb-2"><b>Data:</b> {diario.data}</div>
      <div className="mb-2"><b>Clima:</b> {diario.clima || '-'}</div>
      <div className="mb-2"><b>Atividades Executadas:</b> {diario.atividadesExecutadas || '-'}</div>
      <div className="mb-2"><b>Observações:</b> {diario.observacoes || '-'}</div>
      <div className="flex gap-2 mt-4">
        {onEdit && <button className="btn btn-secondary" onClick={() => onEdit(diarioId)}>Editar</button>}
        {onDelete && <button className="btn btn-danger" onClick={() => onDelete(diarioId)}>Excluir</button>}
      </div>
    </div>
  );
};

export default ObraDiarioView;
