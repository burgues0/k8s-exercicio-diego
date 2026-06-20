export interface Material {
  id: number;
  codigo: string;
  nome: string;
  unidadeMedida?: string;
  descricao?: string;
  precoUnitario: number | string;
  fabricante?: string;
  modelo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialDto {
  codigo: string;
  nome: string;
  unidadeMedida?: string;
  descricao?: string;
  precoUnitario?: number;
  fabricante?: string;
  modelo?: string;
}

export interface UpdateMaterialDto {
  codigo?: string;
  nome?: string;
  unidadeMedida?: string;
  descricao?: string;
  precoUnitario?: number;
  fabricante?: string;
  modelo?: string;
}
