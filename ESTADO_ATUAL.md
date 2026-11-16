# Estado atual do Gestor Tech

> Retrato do repositório em 16 de novembro de 2026, na branch `developer`, incluindo as alterações locais ainda não versionadas.

## Resumo executivo

O fluxo principal do MVP está implementado de ponta a ponta. O frontend Vue consome a API Express real para autenticação, projetos, equipe e atividades; o backend aplica as permissões contextuais e persiste os dados em SQLite.

Uma conta pode criar um projeto, adicionar por e-mail uma segunda conta já cadastrada e atribuir uma atividade a ela. A segunda conta consulta suas atividades e altera o próprio status. Ao recarregar os dados, o gerente vê os indicadores atualizados no dashboard. A persistência foi validada também após fechar e reabrir a conexão do TypeORM com o mesmo arquivo de teste.

| Área | Estado | Evidência |
|---|---|---|
| Autenticação | Concluída | Cadastro, login, sessão atual, logout stateless e JWT. |
| Projetos | Concluída para o MVP | Criar, listar, consultar e editar com validações e acesso contextual. |
| Equipe | Concluída para o MVP | Listar, adicionar por e-mail e remover com proteção de atribuições. |
| Atividades | Concluída para o MVP | Listar, criar, editar, excluir, alterar status e consultar as próprias. |
| Dashboard | Concluído para o MVP | Métricas calculadas no cliente com a lista completa de atividades. |
| Persistência | Concluída | SQLite com entidades e relações TypeORM. |
| Testes | Implementados | Integração do backend e regras de métricas do frontend. |
| CI | Implementado | Tipos, testes e builds sem remover os workflows acadêmicos. |

## Arquitetura entregue

```text
Navegador
   │
   ▼
Vue 3 + TypeScript
   ├── Vue Router: rotas públicas e autenticadas
   ├── Pinia: sessão
   ├── Fetch API: contrato REST real
   └── cálculo dos indicadores com todas as atividades
   │
   ▼
Express + TypeScript
   ├── JWT: autenticação
   ├── Zod: entrada e parâmetros
   ├── serviços: autorização e regras de negócio
   └── TypeORM
       │
       ▼
     SQLite
```

Entidades persistidas:

- `User`: conta e papel global `ADMIN` ou `USER`;
- `Project`: dados, período, status e gerente;
- `ProjectMember`: associação única entre projeto e usuário;
- `Activity`: atividade, projeto, responsável opcional, prioridade, status e prazo.

O papel no projeto é derivado das relações. Uma mesma conta pode ser gerente de um projeto e membro de outro.

## Funcionalidades e permissões

### Projetos

- `GET /projects` devolve somente projetos gerenciados ou integrados pelo usuário;
- `POST /projects` define o usuário autenticado como gerente;
- `GET /projects/:id` é permitido a gerente e membros;
- `PUT /projects/:id` é exclusivo do gerente;
- nome, descrição, status, datas válidas e ordem do período são validados.

### Equipe

- gerente e membros consultam a equipe;
- somente o gerente inclui e remove;
- a inclusão exige o e-mail de uma conta existente;
- gerente e membro duplicado são rejeitados;
- o gerente não é uma associação removível;
- a remoção é bloqueada enquanto houver qualquer atividade atribuída ao membro, com orientação para reatribuir ou deixar sem responsável.

### Atividades

- gerente e membros listam todas as atividades do projeto;
- somente o gerente cria, edita e exclui;
- gerente ou responsável altera o status;
- `GET /activities/mine` agrega as atividades da conta e inclui o projeto;
- responsável opcional deve ser o gerente ou membro do mesmo projeto;
- cada operação valida a correspondência entre atividade e projeto da URL.

### Dashboard

O frontend calcula sobre a resposta completa de `/projects/:id/activities`:

- total;
- concluídas;
- pendentes;
- atrasadas;
- percentual de conclusão.

Projeto vazio retorna 0%. Uma atividade é atrasada somente quando `prazo < hoje` e `status != CONCLUIDA`; portanto, prazo de hoje não atrasa e atividade concluída não entra nessa contagem.

## Decisões de compatibilidade

1. **`ADMIN` sem superacesso de projeto.** O backend de autenticação existente preserva `ADMIN` e `USER`, mas todas as consultas de projeto usam gerente ou associação. A frase anterior do `backend/README.md` que previa acesso global do administrador foi substituída porque não era exigência explícita da rubrica e conflitava com o escopo solicitado.
2. **Histórico fora do MVP.** A visão geral chamava `/projects/:id/events`, endpoint planejado mas inexistente. A dependência foi retirada da tela, em vez de implementar histórico de eventos fora do escopo. Os indicadores e o gráfico de andamento permanecem.
3. **Listagem completa para métricas.** O contrato atual continua retornando arrays sem paginação. Assim, projetos, visão geral e dashboard calculam indicadores sobre todas as atividades, sem misturar uma página parcial com o total.
4. **Identificador de membro.** `DELETE /projects/:id/members/:memberId` recebe o `id` da associação `ProjectMember`, igual ao contrato já consumido pelo frontend.

## Verificações automatizadas

Backend (`backend/tests/integration.test.cjs`):

- rejeição de rota protegida sem JWT e login inválido;
- criação de três contas e validação de `/auth/me`;
- projeto com gerente definido pelo servidor;
- mesma conta gerente em um projeto e membro em outro;
- acesso negado à terceira conta, inclusive com papel global `ADMIN`;
- membro sem permissão para editar projeto, gerenciar equipe ou administrar atividades;
- duplicidade de membro;
- responsável sem vínculo;
- membro sem permissão para alterar atividade de outra pessoa;
- conclusão pelo responsável e leitura atualizada pelo gerente;
- persistência após reinicializar a conexão SQLite;
- bloqueio de remoção com atribuição e remoção após deixar sem responsável;
- validação de que a atividade pertence ao projeto da rota.

Frontend (`frontend/src/services/activity.spec.ts`):

- projeto vazio com 0%;
- totais, concluídas, pendentes, atrasadas e percentual;
- prazo de hoje não atrasado;
- atividade concluída e vencida não atrasada.

O workflow `.github/workflows/quality.yml` executa `npm ci`, checagem de tipos, testes e build separadamente para backend e frontend. Os workflows acadêmicos `validar-proposta.yml`, `validar-entrega.yml` e `adicionar-ao-board.yml` foram preservados.

## Comandos de validação

```powershell
cd backend
npm run type-check
npm test
npm run build
```

```powershell
cd frontend
npm run type-check
npm test
npm run build
```

## Limitações restantes

- não há exclusão de projetos, conforme o escopo;
- não há paginação, busca ou filtros no backend; as telas filtram os arrays localmente;
- não há migrações versionadas; `synchronize` é adequado somente ao desenvolvimento;
- não há renovação automática de JWT e a sessão do navegador fica em `localStorage`;
- não há teste automatizado de navegador; a suíte valida API integrada e funções de métricas;
- não há implantação ou configuração de produção;
- histórico de eventos, notificações, anexos, comentários e relatórios avançados permanecem fora do MVP.
