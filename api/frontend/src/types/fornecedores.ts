export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  ativo: boolean;
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

export interface CreateFornecedorDto {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  ativo?: boolean;
  obrasId?: number[];
}

export interface UpdateFornecedorDto {
  nome?: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  ativo?: boolean;
  obrasId?: number[];
}

export interface UpdateFornecedorObrasDto {
  obraIds: number[];
}
