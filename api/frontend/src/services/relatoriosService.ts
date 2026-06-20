import { ApiClient } from "@/lib/api";
import { API_CONFIG } from "@/lib/config";
import { Relatorio, CreateRelatorioDto, UpdateRelatorioDto } from "@/types/relatorios";

export const relatoriosService = {
  async getAllRelatorios(): Promise<Relatorio[]> {
    // Adiciona timestamp para evitar cache
    const timestamp = new Date().getTime();
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.RELATORIOS}?_t=${timestamp}`);
    
    // Transforma os dados garantindo que o campo data_criacao do banco seja preservado
    const transformedData = response.map((relatorio: any) => {
      const transformed = {
        ...relatorio,
        // PRIORIZA o campo data_criacao do banco de dados
        // Só cria dataCriacao se data_criacao existir
        dataCriacao: relatorio.data_criacao || relatorio.dataCriacao || relatorio.createdAt,
      };
      return transformed;
    });
    
    return transformedData;
  },

  async getRelatorioById(id: number): Promise<Relatorio> {
    return await ApiClient.get(`${API_CONFIG.ENDPOINTS.RELATORIOS}/${id}`);
  },

  async createRelatorio(relatorio: CreateRelatorioDto): Promise<Relatorio> {
    const response = await ApiClient.post(API_CONFIG.ENDPOINTS.RELATORIOS, relatorio);
    
    // Se não há resposta (204 No Content), retorna um objeto com os dados criados
    if (!response) {
      return {
        id: Date.now(), // ID temporário
        ...relatorio,
        data_criacao: new Date().toISOString(),
      } as Relatorio;
    }
    
    return response;
  },

  async updateRelatorio(id: number, relatorio: UpdateRelatorioDto): Promise<Relatorio> {
    try {
      const response = await ApiClient.put(`${API_CONFIG.ENDPOINTS.RELATORIOS}/${id}`, relatorio);
      
      // Se não há resposta (204 No Content), retorna um objeto com os dados atualizados
      if (!response) {
        const result = {
          id,
          ...relatorio,
          // Mapeia dataCriacao (DTO) para data_criacao (modelo) e mantém ambos
          data_criacao: relatorio.dataCriacao || new Date().toISOString(),
          dataCriacao: relatorio.dataCriacao || new Date().toISOString(),
        } as Relatorio;
        return result;
      }
      
      return response;
    } catch (error) {
      // Re-lança o erro para garantir que seja tratado pelo componente
      throw error;
    }
  },

  async deleteRelatorio(id: number): Promise<void> {
    await ApiClient.delete(`${API_CONFIG.ENDPOINTS.RELATORIOS}/${id}`);
  }
};
