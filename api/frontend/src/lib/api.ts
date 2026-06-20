import { API_CONFIG } from './config';

export class ApiClient {
  private static getSpecificErrorMessage(endpoint: string, data: any, status: number): string | null {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    if (endpoint.includes('/relatorios/') && status === 400) {
      if (data?.dataCriacao) {
        const dataEnviada = new Date(data.dataCriacao);
        const agora = new Date();
        
        if (dataEnviada > agora) {
          return "A data de criação do relatório não pode ser alterada para o futuro.";
        } else if (isNaN(dataEnviada.getTime())) {
          return "Data de criação inválida fornecida.";
        }
      }
      
      if (data?.fiscalizacaoId && data.fiscalizacaoId <= 0) {
        return "ID da fiscalização deve ser um número positivo.";
      }
      
      if (data?.titulo) {
        if (data.titulo.trim() === '') {
          return "Título do relatório não pode estar vazio.";
        } else if (data.titulo.length > 255) {
          return "Título do relatório é muito longo (máximo 255 caracteres).";
        }
      }
      
      if (data?.conteudo && data.conteudo.length > 10000) {
        return "Conteúdo do relatório é muito longo (máximo 10.000 caracteres).";
      }
    }
    
    if (endpoint.includes('/materiais/') && status === 400) {
      if (data?.nome && data.nome.trim() === '') {
        return "Nome do material não pode estar vazio.";
      }
      if (data?.preco && data.preco < 0) {
        return "Preço do material não pode ser negativo.";
      }
      if (data?.quantidade && data.quantidade < 0) {
        return "Quantidade do material não pode ser negativa.";
      }
    }
    
    // Analisa dados específicos para equipamentos
    if (endpoint.includes('/equipamentos/') && status === 400) {
      if (data?.nome && data.nome.trim() === '') {
        return "Nome do equipamento não pode estar vazio.";
      }
      if (data?.modelo && data.modelo.trim() === '') {
        return "Modelo do equipamento não pode estar vazio.";
      }
    }
    
    // Analisa dados específicos para fornecedores
    if (endpoint.includes('/fornecedores/') && status === 400) {
      if (data?.nome && data.nome.trim() === '') {
        return "Nome do fornecedor não pode estar vazio.";
      }
      if (data?.cnpj && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(data.cnpj)) {
        return "CNPJ do fornecedor deve estar no formato correto (XX.XXX.XXX/XXXX-XX).";
      }
      if (data?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return "E-mail do fornecedor deve ter um formato válido.";
      }
    }
    
    return null;
  }

  private static getHeaders(includeAuth = true, token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      let authToken = token;
      if (!authToken && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';').map(c => c.trim());
        for (const c of cookies) {
          if (c.startsWith('auth-token=')) {
            authToken = decodeURIComponent(c.substring('auth-token='.length));
            break;
          }
        }
      }
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
    }

    return headers;
  }

  private static getBaseUrl(isAuthEndpoint: boolean): string {
    return isAuthEndpoint ? API_CONFIG.AUTH_BASE_URL : API_CONFIG.OBRAS_BASE_URL;
  }

  static async post(endpoint: string, data: unknown, includeAuth = true, isAuthEndpoint = false, token?: string) {
    const baseUrl = this.getBaseUrl(isAuthEndpoint);
    
    try {
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: this.getHeaders(includeAuth, token),
        body: JSON.stringify(data),
      };
      if (includeAuth && !token) {
        fetchOptions.credentials = 'include';
      }
      const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        
        console.error(`[API POST] Erro - Status: ${response.status}, URL: ${baseUrl}${endpoint}`);
        
        let errorMessage = errorData.message || 
                          errorData.error || 
                          errorData.msg || 
                          errorData.detail || 
                          errorData.description ||
                          errorData.mensagem;
        
        if (!errorMessage) {
          switch (response.status) {
            case 400:
              errorMessage = "Dados inválidos na requisição";
              break;
            case 401:
              errorMessage = "Credenciais inválidas";
              break;
            case 403:
              errorMessage = "Acesso negado";
              break;
            case 404:
              errorMessage = "Recurso não encontrado";
              break;
            case 500:
              errorMessage = "Erro interno do servidor";
              break;
            default:
              errorMessage = `Erro HTTP ${response.status}`;
          }
        }
        
        const error = new Error(errorMessage) as Error & {
          status?: number;
          statusText?: string;
          data?: unknown;
        };
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        throw error;
      }

      return response.json();
    } catch (err: unknown) {
      const error = err as Error & { status?: number };
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Erro de conexão. Verifique se o servidor está rodando.') as Error & { status?: number };
        networkError.status = 0;
        throw networkError;
      }
      throw err;
    }
  }

  static async get(endpoint: string, includeAuth = true, isAuthEndpoint = false, token?: string) {
    const baseUrl = this.getBaseUrl(isAuthEndpoint);
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: this.getHeaders(includeAuth, token),
    };
    if (includeAuth && !token) {
      fetchOptions.credentials = 'include';
    }
    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      
      let errorMessage = errorData.message || 
                        errorData.error || 
                        errorData.msg || 
                        errorData.detail || 
                        errorData.description ||
                        errorData.mensagem;
      
      if (!errorMessage) {
        switch (response.status) {
          case 401:
            errorMessage = "Credenciais inválidas";
            break;
          case 403:
            errorMessage = "Acesso negado";
            break;
          case 404:
            errorMessage = "Recurso não encontrado";
            break;
          case 500:
            errorMessage = "Erro interno do servidor";
            break;
          default:
            errorMessage = `Erro HTTP ${response.status}`;
        }
      }
      
      const error = new Error(errorMessage) as Error & {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      throw error;
    }

    return response.json();
  }

  static async put(endpoint: string, data: unknown, includeAuth = true, isAuthEndpoint = false, token?: string) {
    const baseUrl = this.getBaseUrl(isAuthEndpoint);
    const fetchOptions: RequestInit = {
      method: 'PUT',
      headers: this.getHeaders(includeAuth, token),
      body: JSON.stringify(data),
    };
    if (includeAuth && !token) {
      fetchOptions.credentials = 'include';
    }
    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      
      let errorMessage = errorData.message || 
                        errorData.error || 
                        errorData.msg || 
                        errorData.detail || 
                        errorData.description ||
                        errorData.mensagem;
      
      // Verificação para fiscalizacaoId inexistente
      if ((response.status === 404 || response.status === 400) && endpoint.includes('/relatorios/') && data && typeof data === 'object' && 'fiscalizacaoId' in data) {
        errorMessage = `Fiscalização com o ID ${(data as any).fiscalizacaoId} não foi encontrada.`;
        
        const error = new Error(errorMessage) as Error & {
          status?: number;
          statusText?: string;
          data?: unknown;
        };
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        throw error;
      }
      
      if (errorMessage === `Erro ao atualizar relatorio com ID ${endpoint.split('/').pop()}.`) {
        if (response.status === 404) {
          const id = endpoint.split('/').pop();
          errorMessage = `Relatório com o ID ${id} não foi encontrado.`;
        } else if (response.status === 400) {
          const id = endpoint.split('/').pop();
          const specificMessage = this.getSpecificErrorMessage(endpoint, data, response.status);
          
          if (!specificMessage) {
            errorMessage = `Relatório com o ID ${id} não foi encontrado.`;
          } else {
            errorMessage = specificMessage;
          }
        }
      } else if (!errorMessage || errorMessage === '' || errorMessage === 'undefined') {
        if (response.status === 404 || response.status === 400) {
          if (endpoint.includes('/relatorios/') && data && typeof data === 'object' && 'fiscalizacaoId' in data) {
            errorMessage = `Fiscalização com o ID ${(data as any).fiscalizacaoId} não foi encontrada.`;
          } else {
            const id = endpoint.split('/').pop();
            if (endpoint.includes('/relatorios/')) {
              errorMessage = `Relatório com o ID ${id} não foi encontrado.`;
            } else if (endpoint.includes('/materiais/')) {
              errorMessage = `Material com o ID ${id} não foi encontrado.`;
            } else if (endpoint.includes('/equipamentos/')) {
              errorMessage = `Equipamento com o ID ${id} não foi encontrado.`;
            } else if (endpoint.includes('/fornecedores/')) {
              errorMessage = `Fornecedor com o ID ${id} não foi encontrado.`;
            } else if (endpoint.includes('/obras/')) {
              errorMessage = `Obra com o ID ${id} não foi encontrada.`;
            }
          }
        }
      } else if (errorMessage?.includes('Erro ao') && errorMessage?.includes('com ID')) {
        if (response.status === 404) {
          const idMatch = errorMessage.match(/ID (\d+)/);
          const id = idMatch ? idMatch[1] : 'especificado';
          if (endpoint.includes('/relatorios/')) {
            errorMessage = `Relatório com o ID ${id} não foi encontrado.`;
          } else if (endpoint.includes('/materiais/')) {
            errorMessage = `Material com o ID ${id} não foi encontrado.`;
          } else if (endpoint.includes('/equipamentos/')) {
            errorMessage = `Equipamento com o ID ${id} não foi encontrado.`;
          } else if (endpoint.includes('/fornecedores/')) {
            errorMessage = `Fornecedor com o ID ${id} não foi encontrado.`;
          } else if (endpoint.includes('/obras/')) {
            errorMessage = `Obra com o ID ${id} não foi encontrada.`;
          }
        } else if (response.status === 400) {
          const specificMessage = this.getSpecificErrorMessage(endpoint, data, response.status);
          if (specificMessage) {
            errorMessage = specificMessage;
          }
        }
      }
      
      if (!errorMessage) {
        switch (response.status) {
          case 400:
            if (endpoint.includes('/relatorios/')) {
              errorMessage = "Dados inválidos fornecidos para o relatório. Verifique os campos e tente novamente.";
            } else if (endpoint.includes('/materiais/')) {
              errorMessage = "Dados inválidos fornecidos para o material. Verifique os campos e tente novamente.";
            } else if (endpoint.includes('/equipamentos/')) {
              errorMessage = "Dados inválidos fornecidos para o equipamento. Verifique os campos e tente novamente.";
            } else if (endpoint.includes('/fornecedores/')) {
              errorMessage = "Dados inválidos fornecidos para o fornecedor. Verifique os campos e tente novamente.";
            } else if (endpoint.includes('/obras/')) {
              errorMessage = "Dados inválidos fornecidos para a obra. Verifique os campos e tente novamente.";
            } else {
              errorMessage = "Dados inválidos fornecidos";
            }
            break;
          case 401:
            errorMessage = "Credenciais inválidas. Faça login novamente.";
            break;
          case 403:
            errorMessage = "Você não tem permissão para realizar esta ação.";
            break;
          case 404:
            if (endpoint.includes('/relatorios/')) {
              errorMessage = "Relatório com o ID especificado não foi encontrado.";
            } else if (endpoint.includes('/materiais/')) {
              errorMessage = "Material com o ID especificado não foi encontrado.";
            } else if (endpoint.includes('/equipamentos/')) {
              errorMessage = "Equipamento com o ID especificado não foi encontrado.";
            } else if (endpoint.includes('/fornecedores/')) {
              errorMessage = "Fornecedor com o ID especificado não foi encontrado.";
            } else if (endpoint.includes('/obras/')) {
              errorMessage = "Obra com o ID especificado não foi encontrada.";
            } else {
              errorMessage = "Recurso com o ID especificado não foi encontrado.";
            }
            break;
          case 409:
            errorMessage = "Conflito: Este recurso já existe ou está sendo usado.";
            break;
          case 422:
            errorMessage = "Dados fornecidos não passaram na validação.";
            break;
          case 500:
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
            break;
          case 503:
            errorMessage = "Serviço temporariamente indisponível. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
        }
      }
      
      const error = new Error(errorMessage) as Error & {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    if (!contentType?.includes('application/json') || contentLength === '0' || response.status === 204) {
      return;
    }

    try {
      return await response.json();
    } catch {
      return;
    }
  }

  static async delete(endpoint: string, includeAuth = true, isAuthEndpoint = false, token?: string) {
    const baseUrl = this.getBaseUrl(isAuthEndpoint);
    const fetchOptions: RequestInit = {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth, token),
    };
    if (includeAuth && !token) {
      fetchOptions.credentials = 'include';
    }
    const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }
      
      let errorMessage = errorData.message || 
                        errorData.error || 
                        errorData.msg || 
                        errorData.detail || 
                        errorData.description ||
                        errorData.mensagem;
      
      if (!errorMessage) {
        switch (response.status) {
          case 401:
            errorMessage = "Credenciais inválidas";
            break;
          case 403:
            errorMessage = "Acesso negado";
            break;
          case 404:
            errorMessage = "Recurso não encontrado";
            break;
          case 500:
            errorMessage = "Erro interno do servidor";
            break;
          default:
            errorMessage = `Erro HTTP ${response.status}`;
        }
      }
      
      const error = new Error(errorMessage) as Error & {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    if (!contentType?.includes('application/json') || contentLength === '0' || response.status === 204) {
      return;
    }

    try {
      return await response.json();
    } catch {
      return;
    }
  }

  static async patch(endpoint: string, data: unknown, includeAuth = true, isAuthEndpoint = false, token?: string) {
    const baseUrl = this.getBaseUrl(isAuthEndpoint);
    
    try {
      const fetchOptions: RequestInit = {
        method: 'PATCH',
        headers: this.getHeaders(includeAuth, token),
        body: JSON.stringify(data),
      };
      if (includeAuth && !token) {
        fetchOptions.credentials = 'include';
      }
      const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        
        let errorMessage = errorData.message || 
                          errorData.error || 
                          errorData.msg || 
                          errorData.detail || 
                          errorData.description ||
                          errorData.mensagem;
        
        if (!errorMessage) {
          switch (response.status) {
            case 401:
              errorMessage = "Credenciais inválidas";
              break;
            case 403:
              errorMessage = "Acesso negado";
              break;
            case 404:
              errorMessage = "Recurso não encontrado";
              break;
            case 500:
              errorMessage = "Erro interno do servidor";
              break;
            default:
              errorMessage = `Erro HTTP ${response.status}`;
          }
        }
        
        const error = new Error(errorMessage) as Error & {
          status?: number;
          statusText?: string;
          data?: unknown;
        };
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        throw error;
      }

      return response.json();
    } catch (error) {
      console.error('Erro na requisição PATCH:', error);
      throw error;
    }
  }
}

export const AuthService = {
  login: (email: string, senha: string) => 
    ApiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, senha }, false, true),
  
  logout: (token?: string) => 
    ApiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, true, true, token),
  
  verify: (token?: string) => 
    ApiClient.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY, true, true, token),
};

export const ObrasService = {
  getAll: (token?: string, filters?: Record<string, any>) => {
    let endpoint = API_CONFIG.ENDPOINTS.OBRAS;
    if (filters) {
      const params = new URLSearchParams(filters as any).toString();
      endpoint += `?${params}`;
    }
    return ApiClient.get(endpoint, true, false, token);
  },
  getById: (id: string, token?: string) => ApiClient.get(`${API_CONFIG.ENDPOINTS.OBRAS}/${id}`, true, false, token),
  create: (data: any, token?: string) => ApiClient.post(API_CONFIG.ENDPOINTS.OBRAS, data, true, false, token),
  update: (id: string, data: any, token?: string) => ApiClient.put(`${API_CONFIG.ENDPOINTS.OBRAS}/${id}`, data, true, false, token),
  delete: (id: string, token?: string) => ApiClient.delete(`${API_CONFIG.ENDPOINTS.OBRAS}/${id}`, true, false, token),

  getEnderecos: (token?: string) => ApiClient.get(`/enderecos`, true, false, token),
  getEnderecoByObra: (id: string, token?: string) => ApiClient.get(`/obras/${id}/endereco`, true, false, token),
  createEndereco: (id: string, data: any, token?: string) => ApiClient.post(`/obras/${id}/endereco`, data, true, false, token),
  updateEndereco: (id: string, data: any, token?: string) => ApiClient.put(`/obras/${id}/endereco`, data, true, false, token),
  getFornecedores: (id: string, token?: string) => ApiClient.get(`/obras/${id}/fornecedores`, true, false, token),
  getEquipamentos: (id: string, token?: string) => ApiClient.get(`/obras/${id}/equipamentos`, true, false, token),
  getResponsaveisTecnicos: (id: string, token?: string) => ApiClient.get(`/responsaveis-tecnicos/obras/${id}`, true, false, token),
  getFiscalizacoes: (id: string, token?: string) => ApiClient.get(`/fiscalizacoes/obras/${id}/fiscalizacoes`, true, false, token),
  deleteFiscalizacoes: (id: string, token?: string) => ApiClient.delete(`/fiscalizacoes/obras/${id}/fiscalizacoes`, true, false, token),
  createFiscalizacao: (data: any, token?: string) => ApiClient.post(`/fiscalizacoes/obras/fiscalizacao`, data, true, false, token),

  getEtapas: (obraId: string | number, token?: string) => ApiClient.get(`/obras/${obraId}/etapas`, true, false, token),
  getEtapaById: (obraId: string | number, etapaId: string | number, token?: string) => ApiClient.get(`/obras/${obraId}/etapas/${etapaId}`, true, false, token),
  createEtapa: (obraId: string | number, data: any, token?: string) => ApiClient.post(`/obras/${obraId}/etapas`, data, true, false, token),
  updateEtapa: (obraId: string | number, etapaId: string | number, data: any, token?: string) => ApiClient.put(`/obras/${obraId}/etapas/${etapaId}`, data, true, false, token),
  deleteEtapa: (obraId: string | number, etapaId: string | number, token?: string) => ApiClient.delete(`/obras/${obraId}/etapas/${etapaId}`, true, false, token),

  getDiarios: (obraId: string | number, token?: string) => ApiClient.get(`/obras/${obraId}/diarios`, true, false, token),
  getDiarioById: (obraId: string | number, diarioId: string | number, token?: string) => ApiClient.get(`/obras/${obraId}/diarios/${diarioId}`, true, false, token),
  createDiario: (obraId: string | number, data: any, token?: string) => ApiClient.post(`/obras/${obraId}/diarios`, data, true, false, token),
  updateDiario: (obraId: string | number, diarioId: string | number, data: any, token?: string) => ApiClient.put(`/obras/${obraId}/diarios/${diarioId}`, data, true, false, token),
  deleteDiario: (obraId: string | number, diarioId: string | number, token?: string) => ApiClient.delete(`/obras/${obraId}/diarios/${diarioId}`, true, false, token),
};

export const MateriaisService = {
  getAll: (token?: string) => ApiClient.get(API_CONFIG.ENDPOINTS.MATERIAIS, true, false, token),
  getById: (id: string, token?: string) => ApiClient.get(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`, true, false, token),
  create: (data: unknown, token?: string) => ApiClient.post(API_CONFIG.ENDPOINTS.MATERIAIS, data, true, false, token),
  update: (id: string, data: unknown, token?: string) => ApiClient.put(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`, data, true, false, token),
  delete: (id: string, token?: string) => ApiClient.delete(`${API_CONFIG.ENDPOINTS.MATERIAIS}/${id}`, true, false, token),
};

export const EquipamentosService = {
  getAll: (token?: string) => ApiClient.get(API_CONFIG.ENDPOINTS.EQUIPAMENTOS, true, false, token),
  getById: (id: string, token?: string) => ApiClient.get(`${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, true, false, token),
  create: (data: unknown, token?: string) => ApiClient.post(API_CONFIG.ENDPOINTS.EQUIPAMENTOS, data, true, false, token),
  update: (id: string, data: unknown, token?: string) => ApiClient.put(`${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, data, true, false, token),
  delete: (id: string, token?: string) => ApiClient.delete(`${API_CONFIG.ENDPOINTS.EQUIPAMENTOS}/${id}`, true, false, token),
};
