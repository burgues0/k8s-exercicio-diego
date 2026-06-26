export const API_CONFIG = {
  AUTH_BASE_URL: 'http://localhost:5000',
  OBRAS_BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify'
    },
    OBRAS: '/obras',
    MATERIAIS: '/materiais',
    EQUIPAMENTOS: '/equipamentos',
    FORNECEDORES: '/fornecedores',
    RESPONSAVEIS_TECNICOS: '/responsaveis-tecnicos',
    FISCALIZACOES: '/fiscalizacoes',
    RELATORIOS: '/relatorios'
  }
};

export const APP_CONFIG = {
  FRONTEND_PORT: 3002,
  AUTH_BACKEND_PORT: 3001,
  OBRAS_BACKEND_PORT: 3000
};
