import { ApiClient } from '@/lib/api';
import { API_CONFIG } from '@/lib/config';
import { Material, CreateMaterialDto, UpdateMaterialDto } from '@/types/materiais';

export const materiaisService = {
  async getAllMateriais(): Promise<Material[]> {
    const response = await ApiClient.get(API_CONFIG.ENDPOINTS.MATERIAIS);
    return response;
  },

  async getMaterialById(id: number): Promise<Material> {
    const response = await ApiClient.get(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`);
    return response;
  },

  async createMaterial(data: CreateMaterialDto): Promise<Material> {
    const response = await ApiClient.post(API_CONFIG.ENDPOINTS.MATERIAIS, data);
    return response;
  },

  async updateMaterial(id: number, data: UpdateMaterialDto): Promise<Material> {
    const response = await ApiClient.put(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`, data);
    return response;
  },

  async deleteMaterial(id: number): Promise<void> {
    await ApiClient.delete(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`);
  }
};
