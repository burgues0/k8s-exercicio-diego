import { API_CONFIG } from "@/lib/config";
import { notifyObraCreated, notifyObraUpdated, notifyObraDeleted } from "@/lib/events";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const obrasService = {
  async getAllObras() {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}`,
      {
        credentials: "include",
        headers: {
          ...authHeaders(),
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao listar obras.");
    }
    return response.json();
  },

  async getObraById(id: number) {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${id}`,
      {
        credentials: "include",
        headers: {
          ...authHeaders(),
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao buscar obra.");
    }
    return response.json();
  },

  async createObra(obraData: any) {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(obraData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao criar obra.");
    }
    
    const result = await response.json();
    notifyObraCreated();
    return result;
  },

  async updateObra(id: number, obraData: any) {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${id}`, {
      method: 'PUT',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(obraData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao atualizar obra.");
    }
    
    const result = await response.json();
    notifyObraUpdated();
    return result;
  },

  async deleteObra(id: number) {
    const response = await fetch(`${API_CONFIG.OBRAS_BASE_URL}${API_CONFIG.ENDPOINTS.OBRAS}/${id}`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        ...authHeaders(),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao deletar obra.");
    }
    
    notifyObraDeleted();
    return true;
  },
};
