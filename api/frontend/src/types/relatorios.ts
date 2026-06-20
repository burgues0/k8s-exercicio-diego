export interface Relatorio {
  id: number;
  titulo: string;
  data_criacao: string;
  dataCriacao?: string;
  fiscalizacaoId: number;
  conteudo?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: string | number | undefined; // Permite acesso por índice de string com tipos específicos
}

export interface CreateRelatorioDto {
  titulo: string;
  fiscalizacaoId: number;
  conteudo: string;
  dataCriacao?: string;
}

export interface UpdateRelatorioDto {
  titulo?: string;
  fiscalizacaoId?: number;
  conteudo?: string;
  dataCriacao?: string;
}

export interface Fiscalizacao {
  id: number;
  nome: string;
  data: string;
  status: string;
}
