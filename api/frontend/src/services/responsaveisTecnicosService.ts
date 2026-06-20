import { API_CONFIG } from "@/lib/config";
import { ResponsavelTecnico, CreateResponsavelTecnicoDto, UpdateResponsavelTecnicoDto, Obra, CreateVinculosObrasDto } from "@/types/responsaveis-tecnicos";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const responsaveisTecnicosService = {
  async getAllResponsaveisTecnicos(): Promise<ResponsavelTecnico[]> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao listar responsáveis técnicos.");
    }
    return response.json();
  },

  async getResponsavelTecnicoById(id: number): Promise<ResponsavelTecnico> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao buscar responsável técnico.");
    }
    return response.json();
  },

  async createResponsavelTecnico(responsavel: CreateResponsavelTecnicoDto): Promise<ResponsavelTecnico> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(responsavel),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `Erro HTTP ${response.status}` }));
      throw new Error(errorData.message || "Falha ao criar responsável técnico.");
    }
    
    return response.json();
  },

  async updateResponsavelTecnico(id: number, responsavel: UpdateResponsavelTecnicoDto): Promise<ResponsavelTecnico> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(responsavel),
    });
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return await this.getResponsavelTecnicoById(id);
    }
    
    const responseText = await response.text();
    if (!responseText.trim()) {
      return await this.getResponsavelTecnicoById(id);
    }
    
    try {
      return JSON.parse(responseText);
    } catch {
      return await this.getResponsavelTecnicoById(id);
    }
  },

  async deleteResponsavelTecnico(id: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }
      throw new Error(errorMessage);
    }
  },

  async assignObrasToResponsavelTecnico(id: number, data: CreateVinculosObrasDto): Promise<void> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}/obras`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data.vinculos),
    });
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
      }
      throw new Error(errorMessage);
    }
  },

  async getObrasDoResponsavelTecnico(id: number): Promise<Obra[]> {
    const url = `${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}/obras`;
    const headers = authHeaders();
    
    const response = await fetch(url, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    
    if (response.status === 204 || response.status === 404) {
      return [];
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      return [];
    }
    
    try {
      const data = JSON.parse(responseText);
      
      if (!Array.isArray(data)) {
        return [];
      }
      
      const obras: Obra[] = data.map((vinculo: any) => {
        if (vinculo.obra) {
          return {
            id: vinculo.obra.id,
            nome: vinculo.obra.nome,
            status: vinculo.obra.status,
            data_inicio: vinculo.obra.data_inicio,
            data_conclusao: vinculo.obra.data_conclusao,
            orcamento_total: parseFloat(vinculo.obra.orcamento_total),
            percentual_concluido: vinculo.obra.percentual_concluido,
            vinculo: {
              data_inicio: vinculo.data_inicio,
              data_fim: vinculo.data_fim,
              tipo_vinculo: vinculo.tipo_vinculo
            }
          } as Obra;
        }
        return null;
      }).filter((obra): obra is Obra => obra !== null);
      
      return obras;
      
    } catch {
      return [];
    }
  },

  async getResponsavelTecnicoDetalhes(id: number): Promise<ResponsavelTecnico & { obras?: Obra[] }> {
    const url = `${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${id}/detalhes`;
    
    const response = await fetch(url, {
      credentials: "include", 
      headers: {
        ...authHeaders(),
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return await this.getResponsavelTecnicoById(id);
      }
      
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  async getVinculoEspecifico(responsavelId: number, obraId: number): Promise<any> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${responsavelId}/obras/${obraId}`, {
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao buscar vínculo específico.");
    }
    
    return response.json();
  },

  async updateVinculoEspecifico(responsavelId: number, obraId: number, vinculo: any): Promise<any> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${responsavelId}/obras/${obraId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(vinculo),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao atualizar vínculo específico.");
    }
    
    return response.json();
  },

  async removeVinculoEspecifico(responsavelId: number, obraId: number): Promise<void> {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.RESPONSAVEIS_TECNICOS}/${responsavelId}/obras/${obraId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao remover vínculo específico.");
    }
  },
};
