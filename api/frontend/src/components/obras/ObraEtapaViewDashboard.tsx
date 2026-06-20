import React, { useEffect, useState } from 'react';
import { ObrasService } from '../../lib/api';

interface ObraEtapaViewDashboardProps {
  obraId: string;
  etapaId: string;
  onEdit?: (etapaId: string) => void;
  onDelete?: (etapaId: string) => void;
  onBack?: () => void;
}

const ObraEtapaViewDashboard: React.FC<ObraEtapaViewDashboardProps> = ({ obraId, etapaId, onEdit, onDelete, onBack }) => {
  const [etapa, setEtapa] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ObrasService.getEtapaById(obraId, etapaId)
      .then(setEtapa)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [obraId, etapaId]);

  if (loading) return <div>Carregando etapa...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!etapa) return null;

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Detalhes da Etapa</h2>
      <div className="mb-3">
        <b>Nome:</b> {etapa.nome}<br />
        <b>Status:</b> {etapa.status}<br />
        <b>Data Início Prevista:</b> {etapa.dataInicioPrevista}<br />
        <b>Data Fim Prevista:</b> {etapa.dataFimPrevista}<br />
        <b>Data Início Real:</b> {etapa.dataInicioReal || '-'}<br />
        <b>Data Fim Real:</b> {etapa.dataFimReal || '-'}<br />
        <b>Descrição:</b> {etapa.descricao || '-'}<br />
      </div>
      <div className="flex gap-2 mt-2">
        {onEdit && <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onEdit(etapa.id)}>Editar</button>}
        {onDelete && <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => onDelete(etapa.id)}>Excluir</button>}
        {onBack && <button className="bg-gray-200 px-4 py-2 rounded" onClick={onBack}>Voltar</button>}
      </div>
    </div>
  );
};

export default ObraEtapaViewDashboard;
