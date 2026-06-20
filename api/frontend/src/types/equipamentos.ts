export interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroDeSerie: string;
  estado: string;
  fornecedorId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Obra {
  id: number;
  data_conclusao?: string;
  data_inicio: string;
  nome: string;
  orcamento_total: number;
  percentual_concluido: number;
  status: string;
}

export interface CreateEquipamentoDto {
  nome: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroDeSerie: string;
  estado: string;
  fornecedorId: number;
  obrasId?: number[];
}

export interface UpdateEquipamentoDto {
  nome?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numeroDeSerie?: string;
  estado?: string;
  fornecedorId?: number;
  obrasId?: number[];
}

export interface UpdateEquipamentoObrasDto {
  obraIds: number[];
}

export interface EquipamentoDetalhes extends Equipamento {
  fornecedor?: {
    id: number;
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    ativo: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  obras?: Obra[];
}