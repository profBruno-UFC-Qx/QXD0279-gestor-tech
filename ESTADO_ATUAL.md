# Estado atual do Gestor Tech

> Retrato do repositório em 13 de outubro de 2026, na branch `developer`, considerando também as alterações locais ainda não versionadas.

## Resumo executivo

O Gestor Tech está na fase de implementação do MVP. O frontend está estruturado e possui telas e serviços para autenticação, projetos, equipes, atividades e acompanhamento de progresso. A checagem de tipos e o build de produção passam sem erros.

O sistema ainda não funciona de ponta a ponta porque o backend não foi implementado. O diretório `backend/` contém somente a documentação do contrato REST esperado pelo frontend. Também não há testes automatizados, credenciais de demonstração, banco de dados, dados de exemplo ou configuração de implantação.

| Área | Estado | Observação |
|---|---|---|
| Proposta e escopo | Definidos | O MVP e as regras de negócio estão descritos em `PROPOSTA.md`. |
| Frontend | Implementado para o MVP | As telas, rotas, tipos, estado de autenticação e clientes HTTP estão presentes. |
| Integração frontend/API | Preparada, não validada | Os serviços Axios existem, mas não há servidor local para responder às requisições. |
| Backend | Não iniciado | Há apenas o contrato em `backend/README.md`; não existe projeto Strapi executável. |
| Banco de dados | Não iniciado | Não há esquema, migrações, seed ou persistência configurada. |
| Testes automatizados | Não iniciados | Não existem suítes nem comando `test` no `package.json`. |
| Qualidade automatizada | Parcial | Há checagem de tipos e build; não há lint, formatação automática ou cobertura. |
| Entrega | Pendente | `ENTREGA.md` ainda é um modelo sem instruções finais, credenciais e matriz CRUD preenchidas. |

## Escopo atual do MVP

O produto foi delimitado para pequenas equipes organizarem projetos de software, seus participantes e suas atividades. Há dois papéis contextuais por projeto:

- **gerente:** cria e edita o projeto, gerencia a equipe e administra atividades;
- **membro:** consulta projetos e atividades dos quais participa e altera o status das atividades sob sua responsabilidade.

O papel não é global: um mesmo usuário pode gerenciar um projeto e ser membro de outro.

Ficam fora deste MVP riscos, comentários, cronograma independente, relatórios e gráficos avançados, notificações, anexos, Kanban, convites por e-mail e métricas avançadas de produtividade.

## Arquitetura encontrada

```text
Navegador
   │
   ▼
Frontend Vue 3 + TypeScript
   ├── Vue Router: rotas públicas e autenticadas
   ├── Pinia: sessão do usuário
   ├── Axios: acesso à API REST
   └── localStorage: token e dados básicos do usuário
   │
   ▼
API REST configurada por VITE_API_URL
   └── ainda não implementada
```

### Tecnologias do frontend

- Vue 3.5;
- TypeScript 6;
- Vite 8;
- Vue Router 5;
- Pinia 4;
- Axios 1.20;
- Node.js `^22.18.0` ou `>=24.12.0`.

O código está organizado em `components`, `layouts`, `router`, `services`, `stores`, `types`, `utils` e `views`. As páginas são carregadas sob demanda pelo roteador.

## Funcionalidades presentes no frontend

### Autenticação

- cadastro com nome, e-mail, senha e confirmação de senha;
- login com validação básica de e-mail e senha;
- armazenamento do token e do usuário no `localStorage`;
- inclusão automática do token Bearer nas requisições;
- logout com limpeza da sessão local;
- proteção das rotas autenticadas pela presença do token.

### Projetos

- listagem dos projetos acessíveis ao usuário;
- criação e edição de projeto;
- status `PLANEJADO`, `EM_ANDAMENTO` e `CONCLUIDO`;
- validação das datas de início e término;
- visão geral com dados do gerente e período do projeto;
- distinção visual entre projetos gerenciados e projetos em que o usuário participa.

Não há exclusão de projeto no contrato ou na interface atual.

### Equipe

- listagem do gerente e dos membros;
- inclusão de usuário cadastrado pelo e-mail;
- remoção de membro com confirmação;
- ações administrativas exibidas somente para o gerente identificado no projeto.

### Atividades

- listagem por projeto;
- criação, edição e exclusão pelo gerente;
- responsável opcional, limitado na interface ao gerente e aos membros carregados;
- prioridades `BAIXA`, `MEDIA` e `ALTA`;
- status `A_FAZER`, `EM_ANDAMENTO` e `CONCLUIDA`;
- alteração de status pelo gerente ou pelo responsável;
- página agregada de atividades atribuídas ao usuário atual.

### Acompanhamento

A visão geral do projeto calcula no cliente:

- total de atividades;
- atividades concluídas;
- atividades pendentes;
- atividades atrasadas;
- percentual de conclusão.

Uma atividade é considerada atrasada quando o prazo é anterior ao dia atual e seu status é diferente de `CONCLUIDA`.

## Rotas da interface

| Rota | Acesso | Finalidade |
|---|---|---|
| `/login` | Público | Autenticação do usuário. |
| `/cadastro` | Público | Criação de conta. |
| `/projetos` | Autenticado | Lista de projetos acessíveis. |
| `/projetos/novo` | Autenticado | Criação de projeto. |
| `/projetos/:projectId` | Autenticado | Visão geral e indicadores. |
| `/projetos/:projectId/editar` | Autenticado | Edição do projeto; a API deve restringir ao gerente. |
| `/projetos/:projectId/equipe` | Autenticado | Consulta e administração da equipe. |
| `/projetos/:projectId/atividades` | Autenticado | Consulta e administração das atividades. |
| `/minhas-atividades` | Autenticado | Atividades atribuídas ao usuário atual. |

Qualquer endereço não reconhecido exibe a página de recurso não encontrado.

## Contrato REST consumido

Todas as requisições usam JSON e a URL base definida por `VITE_API_URL`, cujo exemplo atual é `http://localhost:8080`.

| Método | Endpoint | Uso atual |
|---|---|---|
| `POST` | `/auth/register` | Cadastrar e iniciar sessão. |
| `POST` | `/auth/login` | Autenticar e iniciar sessão. |
| `GET` | `/projects` | Listar projetos acessíveis. |
| `POST` | `/projects` | Criar projeto. |
| `GET` | `/projects/:id` | Obter projeto. |
| `PUT` | `/projects/:id` | Atualizar projeto. |
| `GET` | `/projects/:id/members` | Listar equipe. |
| `POST` | `/projects/:id/members` | Adicionar membro por e-mail. |
| `DELETE` | `/projects/:id/members/:memberId` | Remover membro. |
| `GET` | `/projects/:id/activities` | Listar atividades do projeto. |
| `POST` | `/projects/:id/activities` | Criar atividade. |
| `PUT` | `/projects/:id/activities/:activityId` | Atualizar atividade. |
| `DELETE` | `/projects/:id/activities/:activityId` | Excluir atividade. |
| `PATCH` | `/projects/:id/activities/:activityId/status` | Alterar status da atividade. |
| `GET` | `/activities/mine` | Listar atividades do usuário atual. |

O backend deverá devolver no login e no cadastro um objeto `{ token, user }` e aplicar no servidor todas as regras de participação e autorização. Ocultar botões no frontend não substitui essa validação.

## Situação das entidades e operações

Esta tabela descreve o que já possui interface e cliente HTTP, não uma integração funcional com persistência.

| Entidade | Criação | Leitura | Atualização | Remoção |
|---|---:|---:|---:|---:|
| Usuário | Sim, por cadastro | Apenas sessão atual | Não | Não |
| Projeto | Sim | Sim | Sim | Não |
| Membro do projeto | Sim | Sim | Não se aplica ao modelo atual | Sim |
| Atividade | Sim | Sim | Sim | Sim |

## Validação realizada neste retrato

Em 13 de outubro de 2026, no ambiente local com Node.js 22.20.0 e npm 10.9.3, foi executado:

```bash
cd frontend
npm run build
```

Resultado: **aprovado**. O comando executou `vue-tsc --build` sem erros e o Vite gerou o bundle de produção em `frontend/dist/`.

Não foi possível validar fluxos reais no navegador porque não existe backend para autenticar usuários ou persistir os dados. Também não há testes automatizados a executar.

## Limitações e riscos conhecidos

- o produto não é executável de ponta a ponta sem a API;
- as regras de autorização existem principalmente como comportamento visual e contrato; precisam ser impostas pelo backend;
- o guard de navegação verifica somente se há um token local, sem validar expiração ou autenticidade;
- não há tratamento global de respostas `401`, renovação de token ou expiração de sessão;
- o token é mantido em `localStorage`, decisão que deve ser reavaliada conforme o modelo de segurança do backend;
- o contrato de respostas e erros ainda precisa ser confirmado na integração real;
- não há testes unitários, de componentes, integração ou ponta a ponta;
- o CI atual valida arquivos acadêmicos, mas não executa build ou testes do frontend;
- não há exclusão de projetos;
- não há paginação, busca ou filtros nas listagens;
- não há ambiente conteinerizado, configuração de produção ou pipeline de implantação;
- `ENTREGA.md` ainda não documenta execução completa, credenciais, dificuldades, limitações e rotas finais.

## Próximos passos recomendados

1. Criar o projeto de backend e implementar autenticação, entidades, relacionamentos e permissões.
2. Integrar cada endpoint começando por cadastro/login e pelo CRUD de projetos.
3. Adicionar seed e contas de demonstração para os papéis de gerente e membro.
4. Criar testes para métricas, autenticação, permissões e fluxos CRUD principais.
5. Incluir type-check, build e testes no GitHub Actions.
6. Validar acessibilidade, responsividade e mensagens de erro com a API real.
7. Preencher `ENTREGA.md` depois que ambiente, credenciais e limitações finais estiverem definidos.

## Referências internas

- `PROPOSTA.md`: visão do produto, escopo e regras de negócio;
- `README.md`: visão geral e início rápido;
- `frontend/README.md`: arquitetura e execução do frontend;
- `backend/README.md`: contrato mínimo esperado da API;
- `ENTREGA.md`: modelo a ser concluído para a entrega final.
