import { ApiClient } from "@/lib/api";
import { API_CONFIG } from "@/lib/config";
import { Fiscalizacao, CreateFiscalizacaoDto, UpdateFiscalizacaoDto, FiscalizacaoDetalhes } from "@/types/fiscalizacoes";
import { Relatorio, CreateRelatorioDto } from "@/types/relatorios";

// Função helper para obter token de autenticação
const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const c of cookies) {
    if (c.startsWith('auth-token=')) {
      return decodeURIComponent(c.substring('auth-token='.length));
    }
  }
  return null;
};

// Mapear status do frontend para backend
const mapStatusToBackend = (status: string): string => {
  const statusMapping: { [key: string]: string } = {
    'planejada': 'Planejada',
    'em_andamento': 'Em Andamento',
    'concluida': 'Concluída'
  };
  return statusMapping[status] || status;
};

// Mapear status do backend para frontend
const mapStatusFromBackend = (status: string): string => {
  const statusMapping: { [key: string]: string } = {
    'Planejada': 'planejada',
    'Em Andamento': 'em_andamento',
    'Concluída': 'concluida'
  };
  return statusMapping[status] || status.toLowerCase();
};

// Normalizar fiscalização vinda do backend
const normalizeFiscalizacao = (fiscalizacao: unknown): Fiscalizacao => {
  const f = fiscalizacao as Record<string, unknown>;
  return {
    ...f,
    status: mapStatusFromBackend(f.status as string)
  } as Fiscalizacao;
};

export const fiscalizacoesService = {
  async getAllFiscalizacoes(): Promise<Fiscalizacao[]> {
    // Adiciona timestamp para evitar cache
    const timestamp = new Date().getTime();
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}?_t=${timestamp}`);
    
    // Transforma os dados garantindo que os campos sejam normalizados
    const transformedData = response.map((fiscalizacao: unknown) => {
      const f = fiscalizacao as Record<string, unknown>;
      return normalizeFiscalizacao({
        ...f,
        // Normaliza os campos para o padrão correto
        responsavelTecnicoId: f.responsavelTecnicoId || f.responsavelId || f.responsavel_id,
        obraId: f.obraId || f.obra_id,
      });
    });
    
    return transformedData;
  },

  async getFiscalizacoesRecentes(): Promise<Fiscalizacao[]> {
    const timestamp = new Date().getTime();
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/recentes?_t=${timestamp}`);
    
    // Normaliza os dados também
    const transformedData = response.map((fiscalizacao: unknown) => {
      const f = fiscalizacao as Record<string, unknown>;
      return normalizeFiscalizacao({
        ...f,
        responsavelTecnicoId: f.responsavelTecnicoId || f.responsavelId || f.responsavel_id,
        obraId: f.obraId || f.obra_id,
      });
    });
    
    return transformedData;
  },

  async getFiscalizacaoById(id: number): Promise<Fiscalizacao> {
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/${id}`);
    return normalizeFiscalizacao(response);
  },

  async getFiscalizacaoDetalhes(id: number): Promise<FiscalizacaoDetalhes> {
    try {
      const detalhes = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/${id}/detalhes`);
      return detalhes;
    } catch (error: any) {
      try {
        const fiscalizacao = await this.getFiscalizacaoById(id);
        const fiscalizacaoDetalhes: FiscalizacaoDetalhes = {
          ...fiscalizacao,
          obras: Array.isArray(fiscalizacao.obras) ? fiscalizacao.obras : [],
          responsavelTecnico: typeof fiscalizacao.responsavelTecnico === 'object' ? fiscalizacao.responsavelTecnico : undefined,
          responsavel: typeof fiscalizacao.responsavel === 'object' ? fiscalizacao.responsavel : undefined,
          relatorios: Array.isArray(fiscalizacao.relatorios) ? fiscalizacao.relatorios : []
        };
        return fiscalizacaoDetalhes;
      } catch (fallbackError) {
        throw error;
      }
    }
  },

  async getFiscalizacoesByStatus(status: string): Promise<Fiscalizacao[]> {
    const backendStatus = mapStatusToBackend(status);
    const timestamp = new Date().getTime();
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/status/${backendStatus}?_t=${timestamp}`);
    return response.map((fiscalizacao: unknown) => normalizeFiscalizacao(fiscalizacao));
  },

  async createFiscalizacao(fiscalizacao: CreateFiscalizacaoDto): Promise<Fiscalizacao> {
    // Mapear status se estiver presente
    const updatedFiscalizacao = fiscalizacao.status ? 
      { ...fiscalizacao, status: mapStatusToBackend(fiscalizacao.status) } : 
      fiscalizacao;
    
    const response = await ApiClient.post(API_CONFIG.ENDPOINTS.FISCALIZACOES, updatedFiscalizacao);
    
    // Se não há resposta (204 No Content), retorna um objeto com os dados criados
    if (!response) {
      return {
        id: Date.now(), // ID temporário
        ...updatedFiscalizacao,
        createdAt: new Date().toISOString(),
      } as Fiscalizacao;
    }
    
    return normalizeFiscalizacao(response);
  },

  async createFiscalizacaoParaObra(obraId: number, fiscalizacao: Omit<CreateFiscalizacaoDto, 'obraId'>): Promise<Fiscalizacao> {
    // Mapear status se estiver presente
    const updatedFiscalizacao = fiscalizacao.status ? 
      { ...fiscalizacao, status: mapStatusToBackend(fiscalizacao.status) } : 
      fiscalizacao;
    
    const response = await ApiClient.post(`/fiscalizacoes/obras/fiscalizacao`, {
      ...updatedFiscalizacao,
      obraIds: [obraId]
    });
    
    // Se não há resposta (204 No Content), retorna um objeto com os dados criados
    if (!response) {
      return {
        id: Date.now(), // ID temporário
        ...updatedFiscalizacao,
        obraId,
        createdAt: new Date().toISOString(),
      } as Fiscalizacao;
    }
    
    return normalizeFiscalizacao(response);
  },

  async updateFiscalizacao(id: number, fiscalizacao: UpdateFiscalizacaoDto): Promise<Fiscalizacao> {
    if (!id || id === 0 || isNaN(id) || id === undefined || id === null) {
      throw new Error(`ID da fiscalização inválido: ${id}. Não é possível atualizar a fiscalização.`);
    }

    // Mapear status se estiver presente
    const updatedFiscalizacao = fiscalizacao.status ? 
      { ...fiscalizacao, status: mapStatusToBackend(fiscalizacao.status) } : 
      fiscalizacao;
    
    // Obter token de autenticação
    const authToken = getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.FISCALIZACOES}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: JSON.stringify(updatedFiscalizacao),
    });
    
    if (!response.ok) {
      let errorMessage = `Erro ao atualizar fiscalização ${id}`;
      try {
        const errorData = await response.json();
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.details) {
          errorMessage = errorData.details;
        } else if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message || errorData.errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
        }
      } catch {
        errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Se não há resposta JSON, busca a fiscalização atualizada
      return await this.getFiscalizacaoById(id);
    }
    
    const result = await response.json();
    return normalizeFiscalizacao(result);
  },

  async updateFiscalizacaoStatus(id: number, status: string): Promise<Fiscalizacao> {
    try {
      const backendStatus = mapStatusToBackend(status);
      const response = await ApiClient.patch(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/${id}`, { status: backendStatus });
      
      // Se não há resposta (204 No Content), busca os dados atualizados
      if (!response) {
        return await this.getFiscalizacaoById(id);
      }
      
      return normalizeFiscalizacao(response);
    } catch (error) {
      throw error;
    }
  },

  async deleteFiscalizacao(id: number): Promise<void> {
    await ApiClient.delete(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/${id}`);
  },

  async deleteFiscalizacoesByObra(obraId: number): Promise<void> {
    try {
      // Primeiro tenta buscar as fiscalizações da obra para verificar se existem
      const fiscalizacoes = await this.getAllFiscalizacoes();
      const fiscalizacoesDaObra = fiscalizacoes.filter(f => f.obraId === obraId);
      
      if (fiscalizacoesDaObra.length === 0) {
        // Se não há fiscalizações, não há nada para excluir
        return;
      }
      
      // Tenta excluir usando o endpoint específico
      try {
        await ApiClient.delete(`${API_CONFIG.ENDPOINTS.FISCALIZACOES}/obras/${obraId}/fiscalizacoes`);
        return;
      } catch (endpointError: any) {
        console.warn('Endpoint específico falhou, tentando exclusão individual:', endpointError.message);
        
        // Se o endpoint específico falhar, exclui cada fiscalização individualmente
        for (const fiscalizacao of fiscalizacoesDaObra) {
          try {
            await this.deleteFiscalizacao(fiscalizacao.id);
          } catch (deleteError: any) {
            console.error(`Erro ao excluir fiscalização ${fiscalizacao.id}:`, deleteError.message);
          }
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || `Erro ao excluir fiscalizações da obra com ID ${obraId}`;
      console.error('Erro detalhado ao excluir fiscalizações da obra:', {
        obraId,
        error: error.message,
        status: error.status,
        data: error.data
      });
      throw new Error(errorMessage);
    }
  },

  async getRelatoriosFiscalizacao(id: number): Promise<Relatorio[]> {
    const timestamp = new Date().getTime();
    return await ApiClient.get(`${API_CONFIG.ENDPOINTS.RELATORIOS}/fiscalizacoes/${id}?_t=${timestamp}`);
  },

  async createRelatorioFiscalizacao(id: number, relatorio: CreateRelatorioDto): Promise<Relatorio> {
    try {
      const response = await ApiClient.post(`${API_CONFIG.ENDPOINTS.RELATORIOS}/fiscalizacoes/${id}`, relatorio);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async deleteRelatoriosFiscalizacao(id: number): Promise<void> {
    await ApiClient.delete(`${API_CONFIG.ENDPOINTS.RELATORIOS}/fiscalizacoes/${id}`);
  }
};
