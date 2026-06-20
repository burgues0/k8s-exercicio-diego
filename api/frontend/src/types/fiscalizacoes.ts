export interface Fiscalizacao {
  id: number;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  responsavelTecnicoId: number;
  responsavelId?: number;
  responsavel_id?: number;
  obraId?: number;
  obra_id?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: string | number | undefined; // Permite acesso por índice de string com tipos específicos
}

export interface CreateFiscalizacaoDto {
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  responsavelTecnicoId: number;
  obraId?: number;
}

export interface UpdateFiscalizacaoDto {
  titulo?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
  responsavelTecnicoId?: number;
  obraId?: number;
  obraIds?: number[];
}

export interface FiscalizacaoDetalhes {
  id: number;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  status: string;
  responsavelTecnicoId: number;
  obraId?: number;
  createdAt?: string;
  updatedAt?: string;
  obra?: {
    id: number;
    nome: string;
    localizacao?: string;
  };
  responsavel?: {
    id: number;
    nome: string;
    cpf?: string;
    registro_profissional?: string;
    especialidade?: string;
    ativo?: boolean;
    email?: string;
  };
  responsavelTecnico?: {
    id: number;
    nome: string;
    cpf: string;
    registro_profissional: string;
    especialidade: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
  };
  obras?: {
    id: number;
    nome: string;
    descricao: string;
    status: string;
    data_inicio: string;
    data_conclusao: string;
    orcamento_total: string;
    gastos_atualizados: string;
    percentual_concluido: number;
    latitude: string;
    longitude: string;
    enderecoId: number;
    createdAt: string;
    updatedAt: string;
    ObrasFiscalizacoes: {
      obraId: number;
      fiscalizacaoId: number;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  relatorios?: {
    id: number;
    titulo: string;
    data_criacao: string;
    dataCriacao?: string;
    conteudo?: string;
  }[];
}

export interface ResponsavelTecnico {
  id: number;
  nome: string;
  cpf?: string;
  registro_profissional?: string;
  especialidade?: string;
  ativo?: boolean;
  email?: string;
}

export interface Obra {
  id: number;
  nome: string;
  localizacao?: string;
}
