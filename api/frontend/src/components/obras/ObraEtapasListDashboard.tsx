import React, { useEffect, useState } from 'react';
import { ObrasService } from '../../lib/api';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Calendar } from "lucide-react";

interface Etapa {
  id: string;
  nome: string;
  status?: string;
}

interface ObraEtapasListDashboardProps {
  obraId: string;
  onSelectEtapa?: (etapa: Etapa) => void;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ObraEtapasListDashboard: React.FC<ObraEtapasListDashboardProps> = ({ obraId, onSelectEtapa, onCreate, onEdit, onDelete }) => {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ObrasService.getEtapas(obraId)
      .then(setEtapas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [obraId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Etapas da Obra</h3>
        </div>
        {onCreate && (
          <Button onClick={onCreate} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Etapa
          </Button>
        )}
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando etapas...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro ao carregar etapas</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-2">
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectEtapa && onSelectEtapa(etapa)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{etapa.nome}</h4>
                      {etapa.status && (
                        <p className="text-sm text-gray-600">{etapa.status}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectEtapa && onSelectEtapa(etapa)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(etapa.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(etapa.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {etapas.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Nenhuma etapa cadastrada</p>
          <p className="text-sm">Adicione etapas para organizar o progresso da obra</p>
        </div>
      )}
    </div>
  );
};

export default ObraEtapasListDashboard;
