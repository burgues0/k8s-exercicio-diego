# Frontend - Sistema de Gerenciamento de Obras

Este é o frontend do sistema de gerenciamento de obras, desenvolvido com Next.js 15 e TypeScript.

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3002](http://localhost:3002) no seu navegador.

## Build

```bash
npm run build
npm start
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/          # App Router (páginas e layouts)
│   ├── components/   # Componentes React
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilitários
│   ├── services/     # Serviços de API
│   └── types/        # Tipos TypeScript
├── public/           # Arquivos estáticos
└── ...arquivos de configuração
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```
