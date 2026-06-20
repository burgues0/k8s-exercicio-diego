import React, { useState } from 'react';
import ObraDiariosList from './ObraDiariosList';
import ObraDiarioView from './ObraDiarioView';
import ObraDiarioCreate from './ObraDiarioCreate';
import ObraDiarioEdit from './ObraDiarioEdit';
import ObraDiarioDelete from './ObraDiarioDelete';

interface ObraDiariosSectionProps {
  obraId: string;
}

const ObraDiariosSection: React.FC<ObraDiariosSectionProps> = ({ obraId }) => {
  const [selectedDiario, setSelectedDiario] = useState<any | null>(null);
  const [mode, setMode] = useState<'list' | 'view' | 'create' | 'edit' | 'delete'>('list');
  const [diarioId, setDiarioId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (diario: any) => {
    setDiarioId(diario.id);
    setMode('view');
  };
  const handleCreate = () => setMode('create');
  const handleEdit = (id: string) => {
    setDiarioId(id);
    setMode('edit');
  };
  const handleDelete = (id: string) => {
    setDiarioId(id);
    setMode('delete');
  };
  const handleBack = () => {
    setMode('list');
    setDiarioId(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <section className="mb-4">
      <h2 className="font-bold mb-2">Diários de Obra</h2>
      {mode === 'list' && (
        <ObraDiariosList
          key={refreshKey}
          obraId={obraId}
          onSelectDiario={handleSelect}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {mode === 'view' && diarioId && (
        <ObraDiarioView
          obraId={obraId}
          diarioId={diarioId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      )}
      {mode === 'create' && (
        <ObraDiarioCreate obraId={obraId} onCreated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'edit' && diarioId && (
        <ObraDiarioEdit obraId={obraId} diarioId={diarioId} onUpdated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'delete' && diarioId && (
        <ObraDiarioDelete obraId={obraId} diarioId={diarioId} onDeleted={handleBack} onCancel={handleBack} />
      )}
    </section>
  );
};

export default ObraDiariosSection;
