import { ApiClient } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';
import { Fornecedor, CreateFornecedorDto, UpdateFornecedorDto } from '@/types/fornecedores';

export const fornecedoresService = {
  async getAllFornecedores(): Promise<Fornecedor[]> {
    const response = await ApiClient.get(API_CONFIG.ENDPOINTS.FORNECEDORES);
    return response;
  },

  async getFornecedorById(id: number): Promise<Fornecedor> {
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.FORNECEDORES}/${id}`);
    return response;
  },

  async createFornecedor(data: CreateFornecedorDto): Promise<Fornecedor> {
    const response = await ApiClient.post(API_CONFIG.ENDPOINTS.FORNECEDORES, data);
    return response;
  },

  async updateFornecedor(id: number, data: UpdateFornecedorDto): Promise<Fornecedor> {
    const response = await ApiClient.put(`${API_CONFIG.ENDPOINTS.FORNECEDORES}/${id}`, data);
    return response;
  },

  async patchFornecedor(id: number, data: { ativo: boolean }): Promise<Fornecedor> {
    const response = await ApiClient.patch(`${API_CONFIG.ENDPOINTS.FORNECEDORES}/${id}`, data);
    return response;
  },

  async deleteFornecedor(id: number): Promise<void> {
    await ApiClient.delete(`${API_CONFIG.ENDPOINTS.FORNECEDORES}/${id}`);
  }
};
