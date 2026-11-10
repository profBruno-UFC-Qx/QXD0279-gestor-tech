# Frontend — Gestor Tech

Interface Vue 3 do Gestor Tech, desenhada como um workspace SaaS minimalista para projetos, equipes e atividades. O frontend consome uma API REST e não contém dados mockados nem persistência local de projetos, membros ou atividades. Somente a sessão autenticada é mantida no `localStorage`.

## Tecnologias

- Vue 3.5 com Composition API e `<script setup lang="ts">`;
- TypeScript 6, Vite 8, Vue Router 5 e Pinia 4;
- Reka UI para primitivas acessíveis de Dialog, Alert Dialog e Dropdown Menu;
- Unovis para os gráficos responsivos do dashboard;
- Lucide (`@lucide/vue`) para iconografia consistente;
- Vue Sonner para notificações de sucesso e erro;
- Fontsource para servir Inter e Plus Jakarta Sans localmente.

O projeto não utiliza Tailwind CSS. Os tokens e componentes já existentes eram baseados em CSS escopado; o redesign preservou essa arquitetura e centralizou o design system em custom properties, evitando introduzir uma migração estrutural sem benefício funcional.

## Requisitos e execução

- Node.js `^22.18.0` ou `>=24.12.0`;
- npm.

```bash
cd frontend
npm install
npm run dev
```

Copie o arquivo de ambiente e ajuste a origem do backend se necessário:

```bash
cp .env.example .env
```

No PowerShell, o equivalente é `Copy-Item .env.example .env`. O Vite exibirá a aplicação normalmente em `http://localhost:5173`.

`VITE_API_URL` define a URL base da API e usa `http://localhost:8080` quando omitida. `VITE_API_TIMEOUT_MS` controla o timeout das requisições e usa 15 segundos por padrão. O backend deve liberar a origem do frontend via CORS.

## Integração com a API

O cliente em `src/services/api.ts` centraliza:

- cabeçalhos JSON e `Authorization: Bearer <token>`;
- timeout e mensagens para indisponibilidade da API;
- leitura das mensagens de erro retornadas pelo backend;
- limpeza da sessão ao receber `401 Unauthorized`.

Login e cadastro só criam uma sessão quando a API devolve `{ token, user }`. Em uma recarga, o guard das rotas protegidas valida a sessão por `GET /auth/me`. As antigas chaves da simulação local são removidas na inicialização para impedir que o token fixo de desenvolvimento continue liberando acesso.

Os serviços esperam respostas JSON diretas, sem envelope `data`. O contrato completo de endpoints e campos está em `../backend/README.md`.

## Design system

Os tokens ficam em `src/assets/styles/variables.css` e cobrem:

- paleta oficial e cores semânticas;
- superfícies, bordas e divisórias;
- Inter para interface e Plus Jakarta Sans para títulos;
- escala de espaçamento baseada em 4 px;
- raios, sombras e elevações;
- alturas de controles e dimensões de layout;
- durações, easing e estados interativos.

A aplicação possui somente tema claro. O fundo principal usa `#FEFDFF`, a cor primária é `#0E79B2`, sucesso usa `#00A878`, atenção usa `#F1D302` e o foreground usa `#1D1E2C`.

Componentes reutilizáveis principais:

```text
src/components/
├── dashboard/      # gráficos, métricas, prazos, equipe e atividades
├── layout/         # sidebar, navbar e menu do usuário
├── projects/       # navegação interna do projeto
└── ui/             # botões, campos, cards, badges, tabela, sheet,
                    # confirmação, skeleton, empty state, filtros e avatares
```

Entre os padrões compartilhados estão `PageHeader`, `StatCard`, `StatusBadge`, `PriorityBadge`, `EmptyState`, `LoadingSkeleton`, `ConfirmDialog`, `AppDataTable`, `SearchInput`, `FilterBar`, `ProgressIndicator`, `UserAvatar`, `SectionHeader` e `FormField`.

## Rotas

| Rota | Finalidade |
|---|---|
| `/login` | autenticação pela API |
| `/cadastro` | criação de conta pela API |
| `/dashboard` | seleção de projeto, KPIs, gráficos, prazos e equipe |
| `/projetos` | busca, filtros e listagem de projetos |
| `/projetos/novo` | criação de projeto |
| `/projetos/:projectId` | visão geral e indicadores do projeto |
| `/projetos/:projectId/editar` | edição pelo gerente |
| `/projetos/:projectId/equipe` | inclusão e remoção de membros |
| `/projetos/:projectId/atividades` | CRUD, filtros e atualização de status |
| `/minhas-atividades` | atividades atribuídas ao usuário atual |

## Regras preservadas

- o papel é contextual ao projeto, não global;
- somente o gerente vê ações de edição, equipe e CRUD de atividades;
- o gerente ou o responsável pode atualizar o status de uma atividade;
- atraso é uma condição derivada do prazo e não um status;
- progresso é calculado por atividades concluídas sobre o total;
- remover um membro limpa suas atribuições nas atividades do projeto.

Essas regras orientam a experiência no cliente, mas também precisam ser impostas pelo backend. Ocultar uma ação na interface não constitui uma camada de autorização segura.

## Responsividade e acessibilidade

- sidebar expandida no desktop, compacta no tablet e navegação inferior no smartphone;
- tabelas com região rolável e acessível em telas estreitas;
- dialogs e sheets com foco gerenciado pelo Reka UI;
- labels, mensagens de erro, `aria-live` dos toasts e foco visível;
- contraste semântico e suporte a `prefers-reduced-motion`;
- fontes locais, evitando dependência de CDN em tempo de execução.

## Validação

```bash
npm run type-check
npm run build
npm audit --audit-level=high
```

`npm run build` executa o typecheck antes de gerar o bundle em `dist/`. Não há lint ou testes automatizados configurados neste repositório.
