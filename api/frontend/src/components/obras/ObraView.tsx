"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ObrasService } from "@/lib/api";
import { Obra } from "@/types/obras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppLayout from '@/components/layout-components/applayout';
import ObraEtapasSectionDashboard from "./ObraEtapasSectionDashboard";
import ObraDiariosSectionDashboard from "./ObraDiariosSectionDashboard";
import ObraEnderecoForm from "./ObraEnderecoForm";
import { Building2, MapPin, Truck, HardHat, ClipboardCheck, Calendar, BookOpen } from "lucide-react";

export default function ObraView() {
  const params = useParams();
  const obraId = params?.id as string;
  const [obra, setObra] = useState<Obra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<any>(null);
  const [showEnderecoForm, setShowEnderecoForm] = useState(false);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [fiscalizacoes, setFiscalizacoes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Buscar dados principais
        const [obraData, enderecoData, fornecedoresData, equipamentosData, fiscalizacoesData] = await Promise.all([
          ObrasService.getById(obraId),
          ObrasService.getEnderecoByObra(obraId),
          ObrasService.getFornecedores(obraId),
          ObrasService.getEquipamentos(obraId),
          ObrasService.getFiscalizacoes(obraId),
        ]);
        
        setObra(obraData);
        setEndereco(enderecoData);
        setFornecedores(fornecedoresData);
        setEquipamentos(equipamentosData);
        setFiscalizacoes(fiscalizacoesData);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar detalhes da obra.");
      } finally {
        setLoading(false);
      }
    }
    if (obraId) fetchData();
  }, [obraId]);

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando detalhes da obra...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">Erro ao carregar obra</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">Obra não encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header da Página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Detalhes da Obra</h1>
          <p className="text-gray-600">Visualize e gerencie todas as informações da obra</p>
        </div>
        <Link href="/obras">
          <Button variant="outline">Voltar para Obras</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Detalhes da Obra */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Informações da Obra
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-medium">{obra.nome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{obra.status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Data de Início</p>
                <p className="font-medium">{obra.data_inicio}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Data de Conclusão</p>
                <p className="font-medium">{obra.data_conclusao || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Orçamento Total</p>
                <p className="font-medium">R$ {obra.orcamento_total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Gastos Atualizados</p>
                <p className="font-medium">R$ {obra.gastos_atualizados}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Percentual Concluído</p>
                <p className="font-medium">{obra.percentual_concluido}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-medium">{obra.latitude ?? "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-medium">{obra.longitude ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {showEnderecoForm ? (
              <ObraEnderecoForm
                obraId={obraId}
                initialData={endereco}
                onSaved={async () => {
                  setShowEnderecoForm(false);
                  setLoading(true);
                  try {
                    const data = await ObrasService.getEnderecoByObra(obraId);
                    setEndereco(data);
                  } finally {
                    setLoading(false);
                  }
                }}
                onCancel={() => setShowEnderecoForm(false)}
              />
            ) : (
              <>
                {endereco ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Logradouro</p>
                        <p className="font-medium">{endereco.logradouro || endereco.rua || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Número</p>
                        <p className="font-medium">{endereco.numero || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Bairro</p>
                        <p className="font-medium">{endereco.bairro || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Cidade</p>
                        <p className="font-medium">{endereco.cidade || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">UF</p>
                        <p className="font-medium">{endereco.uf || endereco.estado || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">CEP</p>
                        <p className="font-medium">{endereco.cep || '-'}</p>
                      </div>
                      {endereco.complemento && (
                        <div className="space-y-1 col-span-full">
                          <p className="text-sm text-gray-600">Complemento</p>
                          <p className="font-medium">{endereco.complemento}</p>
                        </div>
                      )}
                    </div>
                    <Button size="sm" onClick={() => setShowEnderecoForm(true)}>
                      Editar Endereço
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">Nenhum endereço cadastrado para esta obra.</p>
                    <Button size="sm" onClick={() => setShowEnderecoForm(true)}>
                      Adicionar Endereço
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Fornecedores */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Fornecedores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {fornecedores.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {fornecedores.map((f: any) => (
                  <span key={f.id} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                    {f.nome || f.razao_social || f.id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum fornecedor associado a esta obra.</p>
            )}
          </CardContent>
        </Card>

        {/* Equipamentos */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <HardHat className="w-6 h-6" />
              Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {equipamentos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {equipamentos.map((e: any) => (
                  <span key={e.id} className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                    {e.nome || e.tipo || e.id}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum equipamento associado a esta obra.</p>
            )}
          </CardContent>
        </Card>

        {/* Fiscalizações */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader style={{ background: '#2C607A' }} className="text-white rounded-t-lg py-3">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6" />
              Fiscalizações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {fiscalizacoes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fiscalizacoes.map((f: any) => (
                  <div key={f.id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{f.titulo || 'Fiscalização'}</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {f.status || 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{f.descricao || '-'}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Início:</span> {f.data_inicio ? f.data_inicio.substring(0,10) : '-'}
                        </div>
                        <div>
                          <span className="font-medium">Fim:</span> {f.data_fim ? f.data_fim.substring(0,10) : '-'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Responsável:</span> {f.responsavelTecnico?.nome || f.responsavelTecnicoId || '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Não há fiscalizações atribuídas a esta obra.</p>
            )}
          </CardContent>
        </Card>          {/* Seção de Etapas da Obra */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {obraId && <ObraEtapasSectionDashboard obraId={obraId} />}
            </CardContent>
          </Card>

          {/* Seção de Diários de Obra */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              {obraId && <ObraDiariosSectionDashboard obraId={obraId} />}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
