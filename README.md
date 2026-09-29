# Gestor Tech

O Gestor Tech é uma aplicação web em desenvolvimento para apoiar o planejamento e o acompanhamento de projetos de software. Esta versão contém a base do frontend, incluindo autenticação, navegação protegida e estrutura para integração futura com uma API REST.

O backend, banco de dados e módulos de negócio ainda não fazem parte desta etapa.

## Tecnologias

- Vue 3;
- TypeScript;
- Vite;
- Vue Router;
- Pinia;
- Axios.

## Estrutura

```text
.
├── frontend/   # Aplicação Vue
└── backend/    # Reservado para a futura API
```

## Executando o frontend

Pré-requisitos:

- Node.js 22.18 ou superior compatível com `frontend/package.json`;
- npm.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

No Windows PowerShell, use `Copy-Item .env.example .env` no lugar de `cp`.

A aplicação será disponibilizada no endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Validação para produção

```bash
cd frontend
npm run build
```

O login já possui validação e tratamento de erro, mas somente será concluído com sucesso quando a API REST for implementada e disponibilizar `POST /auth/login`.

> A proposta está em [`PROPOSTA.md`](PROPOSTA.md) e a documentação da entrega final em [`ENTREGA.md`](ENTREGA.md).
