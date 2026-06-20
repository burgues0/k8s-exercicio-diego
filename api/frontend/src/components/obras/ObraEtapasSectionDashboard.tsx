import React, { useState } from 'react';
import ObraEtapasListDashboard from './ObraEtapasListDashboard';
import ObraEtapaViewDashboard from './ObraEtapaViewDashboard';
import ObraEtapaCreateDashboard from './ObraEtapaCreateDashboard';
import ObraEtapaEditDashboard from './ObraEtapaEditDashboard';
import ObraEtapaDeleteDashboard from './ObraEtapaDeleteDashboard';

interface ObraEtapasSectionDashboardProps {
  obraId: string;
}

const ObraEtapasSectionDashboard: React.FC<ObraEtapasSectionDashboardProps> = ({ obraId }) => {
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
    <div>
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
        <ObraEtapaViewDashboard
          obraId={obraId}
          etapaId={etapaId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      )}
      {mode === 'create' && (
        <ObraEtapaCreateDashboard obraId={obraId} onCreated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'edit' && etapaId && (
        <ObraEtapaEditDashboard obraId={obraId} etapaId={etapaId} onUpdated={handleBack} onCancel={handleBack} />
      )}
      {mode === 'delete' && etapaId && (
        <ObraEtapaDeleteDashboard obraId={obraId} etapaId={etapaId} onDeleted={handleBack} onCancel={handleBack} />
      )}
    </div>
  );
};

export default ObraEtapasSectionDashboard;
