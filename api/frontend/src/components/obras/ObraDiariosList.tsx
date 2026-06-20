import React, { useEffect, useState } from 'react';
import { ObrasService } from '../../lib/api';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, BookOpen, Calendar, User } from "lucide-react";

interface Diario {
  id: string;
  data: string;
  responsavel: string;
  resumo: string;
}

interface ObraDiariosListProps {
  obraId: string;
  onSelectDiario?: (diario: Diario) => void;
  onCreate?: () => void;
}

const ObraDiariosList: React.FC<ObraDiariosListProps & {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ obraId, onSelectDiario, onCreate, onEdit, onDelete }) => {
  const [diarios, setDiarios] = useState<Diario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ObrasService.getDiarios(obraId)
      .then(setDiarios)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [obraId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Diários de Obra</h3>
        </div>
        {onCreate && (
          <Button onClick={onCreate} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Diário
          </Button>
        )}
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando diários...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro ao carregar diários</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-3">
          {diarios.map((diario) => (
            <div
              key={diario.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectDiario && onSelectDiario(diario)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{diario.data}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{diario.responsavel}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{diario.resumo}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectDiario && onSelectDiario(diario)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(diario.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(diario.id)}
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
      
      {diarios.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">Nenhum diário cadastrado</p>
          <p className="text-sm">Adicione diários para registrar o progresso diário da obra</p>
        </div>
      )}
    </div>
  );
};

export default ObraDiariosList;
