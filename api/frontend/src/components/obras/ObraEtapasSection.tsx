import React, { useState } from 'react';
import ObraEtapasListDashboard from './ObraEtapasListDashboard';
import ObraEtapaView from './ObraEtapaView';
import ObraEtapaCreate from './ObraEtapaCreate';
import ObraEtapaEdit from './ObraEtapaEdit';
import ObraEtapaDelete from './ObraEtapaDelete';

interface ObraEtapasSectionProps {
  obraId: string;
}

const ObraEtapasSection: React.FC<ObraEtapasSectionProps> = ({ obraId }) => {
  const [selectedEtapa, setSelectedEtapa] = useState<any | null>(null);
  const [mode, setMode] = useState<'list' | 'view' | 'create' | 'edit' | 'delete'>('list');
  const [etapaId, setEtapaId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelect = (etapa: any) => {
    setEtapaId(etapa.id);
    setMode('view');
  };
  const handleCreate = () => setMode('create');
  const handleEdit = (id: string) => {
    setEtapaId(id);
    setMode('edit');
  };
  const handleDelete = (id: string) => {
    setEtapaId(id);
    setMode('delete');
  };
  const handleBack = () => {
    setMode('list');
    setEtapaId(null);
    setRefreshKey(k => k + 1);
  };

  return (
    <section className="mb-4">
      <h2 className="font-bold mb-2">Etapas da Obra</h2>
      {mode === 'list' && (
        <ObraEtapasListDashboard
          key={refreshKey}
          obraId={obraId}
          onSelectEtapa={handleSelect}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {mode === 'view' && etapaId && (
        <ObraEtapaView
          obraId={obraId}
          etapaId={etapaId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      )}
      {mode === 'create' && (
        <ObraEtapaCreate obraId={obraId} onCreated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'edit' && etapaId && (
        <ObraEtapaEdit obraId={obraId} etapaId={etapaId} onUpdated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'delete' && etapaId && (
        <ObraEtapaDelete obraId={obraId} etapaId={etapaId} onDeleted={handleBack} onCancel={handleBack} />
      )}
    </section>
  );
};

export default ObraEtapasSection;
