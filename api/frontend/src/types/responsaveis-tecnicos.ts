export interface ResponsavelTecnico {
  id: number;
  nome: string;
  cpf: string;
  registro_profissional: string;
  especialidade: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Obra {
  id: number;
  data_conclusao?: string;
  data_inicio: string;
  nome: string;
  orcamento_total: number;
  percentual_concluido: number;
  status: string;
  vinculo?: {
    data_inicio: string;
    data_fim: string | null;
    tipo_vinculo: string;
  };
}

export interface CreateResponsavelTecnicoDto {
  nome: string;
  cpf: string;
  registro_profissional: string;
  especialidade: string;
  ativo: boolean;
}

export interface UpdateResponsavelTecnicoDto {
  nome?: string;
  cpf?: string;
  registro_profissional?: string;
  especialidade?: string;
  ativo?: boolean;
}

export interface UpdateResponsavelTecnicoObrasDto {
  obraIds: number[];
}

export type TipoVinculoResponsavel = "RT Geral" | "RT Execução" | "RT Projeto";

export interface VinculoObraResponsavel {
  obraId: number;
  dataInicio: string;
  dataFim: string | null;
  tipoVinculo: TipoVinculoResponsavel;
}

export interface CreateVinculosObrasDto {
  vinculos: VinculoObraResponsavel[];
}
