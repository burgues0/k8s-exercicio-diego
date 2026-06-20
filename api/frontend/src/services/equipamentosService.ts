import { API_CONFIG } from "@/lib/config";
import { Equipamento, CreateEquipamentoDto, UpdateEquipamentoDto, UpdateEquipamentoObrasDto, Obra, EquipamentoDetalhes } from "@/types/equipamentos";
import { fornecedoresService } from "./fornecedoresService";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const equipamentosService = {
  async getAllEquipamentos(): Promise<Equipamento[]> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao listar equipamentos.");
    }
    return response.json();
  },

  async getEquipamentoById(id: number): Promise<Equipamento> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao buscar equipamento.");
    }
    return response.json();
  },

  async createEquipamento(equipamento: CreateEquipamentoDto): Promise<Equipamento> {
    
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(equipamento),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Erro HTTP ${response.status}` }));
      throw new Error(errorData.message || "Falha ao criar equipamento.");
    }
    
    const equipamentoCriado = await response.json();
    
    return equipamentoCriado;
  },

  async updateEquipamento(id: number, equipamento: UpdateEquipamentoDto): Promise<Equipamento> {
    if (!id || id === 0 || isNaN(id) || id === undefined || id === null) {
      throw new Error(`ID do equipamento inválido: ${id}. Não é possível atualizar o equipamento.`);
    }
    
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, {
      method: "PUT", // Mudando para PUT para evitar problemas com PATCH
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(equipamento),
    });
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore parse error
      }
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return await this.getEquipamentoById(id);
    }
    
    const responseText = await response.text();
    if (!responseText.trim()) {
      return await this.getEquipamentoById(id);
    }
    
    try {
      const equipamentoAtualizado = JSON.parse(responseText);
      return equipamentoAtualizado;
    } catch {
      return await this.getEquipamentoById(id);
    }
  },

  async updateEquipamentoObras(id: number, obras: UpdateEquipamentoObrasDto): Promise<Equipamento> {
    if (!id || id === 0 || isNaN(id)) {
      throw new Error(`ID do equipamento inválido: ${id}. Não é possível atualizar as obras.`);
    }


    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(obras),
    });
    
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP ${response.status} - ${response.statusText}` 
      }));
      
      if (response.status === 404) {
        throw new Error(`Endpoint não encontrado (404): PATCH ${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id} não está implementado no backend`);
      } else if (response.status === 405) {
        throw new Error(`Método não permitido (405): O backend não suporta PATCH para ${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`);
      }
      
      throw new Error(errorData.message || `Falha ao atualizar obras do equipamento (HTTP ${response.status})`);
    }
    
    const resultado = await response.json();
    return resultado;
  },

  async updateEquipamentoObrasPUT(id: number, obras: UpdateEquipamentoObrasDto): Promise<Equipamento> {
    
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}/obras`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(obras),
    });
    
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP ${response.status} - ${response.statusText}` 
      }));
      throw new Error(errorData.message || `Falha ao atualizar obras do equipamento via PUT (HTTP ${response.status})`);
    }
    
    const resultado = await response.json();
    return resultado;
  },

  async associarObrasIndividualmente(id: number, obraIds: number[]): Promise<void> {
    
    for (const obraId of obraIds) {
      try {
        const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${obraId}/equipamentos`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify({ equipamentoId: id }),
        });
        
        if (!response.ok) {
        } else {
        }
      } catch {
        // Ignore error
      }
    }
  },

  async deleteEquipamento(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao deletar equipamento.");
    }
  },

  async getEquipamentosByObraId(obraId: number): Promise<Equipamento[]> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${obraId}/equipamentos`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao buscar equipamentos da obra.");
    }
    return response.json();
  },

  async getObrasByEquipamentoId(equipamentoId: number): Promise<Obra[]> {
    try {
      
      // Buscar todas as obras primeiro
      const obrasResponse = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}`, {
        credentials: "include",
        headers: {
          ...authHeaders(),
        },
      });
      
      if (!obrasResponse.ok) {
        const errorData = await obrasResponse.json().catch(() => ({ message: `Erro HTTP ${obrasResponse.status}` }));
        throw new Error(errorData.message || "Falha ao buscar obras.");
      }
      
      const todasObras = await obrasResponse.json();
      
      const obrasComEquipamento: Obra[] = [];
      
      // Para cada obra, verificar se este equipamento está associado
      for (const obra of todasObras) {
        try {
          const equipamentosResponse = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${obra.id}/equipamentos`, {
            credentials: "include",
            headers: {
              ...authHeaders(),
            },
          });
          
          if (equipamentosResponse.ok) {
            const equipamentosNaObra = await equipamentosResponse.json();
            
            // Verificar se o equipamento está na lista
            const equipamentoEncontrado = equipamentosNaObra.find((eq: { id: number }) => eq.id === equipamentoId);
            if (equipamentoEncontrado) {
              obrasComEquipamento.push(obra);
            }
          }
        } catch {
          // Se der erro ao buscar equipamentos da obra, continua para a próxima
          continue;
        }
      }
      
      return obrasComEquipamento;
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      }
      throw error;
    }
  },

  async createEquipamentoSemObras(equipamento: Omit<CreateEquipamentoDto, 'obrasId'>): Promise<Equipamento> {
    
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(equipamento),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Erro HTTP ${response.status}` }));
      throw new Error(errorData.message || "Falha ao criar equipamento.");
    }
    
    const equipamentoCriado = await response.json();
    return equipamentoCriado;
  },

  async getEquipamentoDetalhes(id: number): Promise<EquipamentoDetalhes> {
    try {
      // Buscar dados básicos do equipamento
      const equipamento = await this.getEquipamentoById(id);
      
      // Buscar detalhes do fornecedor
      let fornecedor = null;
      if (equipamento.fornecedorId) {
        try {
          fornecedor = await fornecedoresService.getFornecedorById(equipamento.fornecedorId);
        } catch (error) {
          console.error("Erro ao carregar fornecedor:", error);
        }
      }
      
      // Buscar obras associadas
      let obras: Obra[] = [];
      try {
        obras = await this.getObrasByEquipamentoId(id);
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
      }
      
      return {
        ...equipamento,
        fornecedor: fornecedor || undefined,
        obras
      };
    } catch (error) {
      console.error("Erro ao carregar detalhes do equipamento:", error);
      throw error;
    }
  },
};
