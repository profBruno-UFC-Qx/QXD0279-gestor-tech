# Backend — Gestor Tech

API REST do MVP em Express, TypeScript, TypeORM e SQLite. A autenticação usa JWT e bcrypt; as permissões de gerente, membro e responsável são verificadas no servidor em todas as operações protegidas.

## Requisitos e primeira execução

- Node.js `^22.18.0` ou `>=24.12.0`;
- npm.

No PowerShell:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:init
npm run dev
```

No Bash:

```bash
cd backend
npm install
cp .env.example .env
npm run db:init
npm run dev
```

A API fica em `http://localhost:8080`. O endpoint `GET /health` informa se a conexão foi iniciada. `npm run dev` compila o TypeScript e inicia `dist/server.js`; reinicie o comando depois de alterar o backend.

## Variáveis de ambiente

| Variável | Padrão | Uso |
|---|---|---|
| `PORT` | `8080` | Porta HTTP da API. |
| `DATABASE_PATH` | `./data/gestor-tech.sqlite` | Arquivo SQLite. |
| `DATABASE_SYNCHRONIZE` | `true` fora de produção | Sincronização de tabelas pelo TypeORM. |
| `JWT_SECRET` | chave local de desenvolvimento | Assinatura dos tokens. Deve ser trocada fora do ambiente local. |
| `JWT_EXPIRES_IN` | `8h` | Validade do JWT. |
| `CORS_ORIGINS` | `http://localhost:5173` | Origens permitidas, separadas por vírgula. |
| `ADMIN_NAME` | opcional | Nome do administrador inicial. |
| `ADMIN_EMAIL` | opcional | E-mail do administrador inicial. |
| `ADMIN_PASSWORD` | opcional | Senha do administrador inicial, mínimo de 8 caracteres. |

O `.env.example` contém valores somente para desenvolvimento. Arquivos `.env` e `.sqlite` são ignorados pelo Git.

## Contrato REST

As requisições usam JSON, sem envelope `data`, e as rotas protegidas exigem `Authorization: Bearer <token>`. Datas de domínio usam `YYYY-MM-DD`. Erros têm a forma `{ "message": "..." }`; erros de validação também incluem `errors`.

| Método | Endpoint | Regra principal |
|---|---|---|
| `POST` | `/auth/register` | Cria conta `USER` e devolve `{ token, user }`. |
| `POST` | `/auth/login` | Autentica e devolve `{ token, user }`. |
| `GET` | `/auth/me` | Retorna a conta da sessão. |
| `POST` | `/auth/logout` | Logout stateless; responde `204`. |
| `GET` | `/projects` | Lista somente projetos gerenciados ou integrados pelo usuário. |
| `POST` | `/projects` | Cria projeto e define o usuário autenticado como gerente. |
| `GET` | `/projects/:id` | Gerente ou membro consulta o projeto. |
| `PUT` | `/projects/:id` | Somente o gerente edita. |
| `GET` | `/projects/:id/members` | Gerente ou membro consulta a equipe. |
| `POST` | `/projects/:id/members` | Gerente adiciona uma conta existente por e-mail. |
| `DELETE` | `/projects/:id/members/:memberId` | Gerente remove a associação indicada. |
| `GET` | `/projects/:id/activities` | Gerente ou membro lista todas as atividades do projeto. |
| `POST` | `/projects/:id/activities` | Somente o gerente cria. |
| `PUT` | `/projects/:id/activities/:activityId` | Somente o gerente edita. |
| `DELETE` | `/projects/:id/activities/:activityId` | Somente o gerente exclui. |
| `PATCH` | `/projects/:id/activities/:activityId/status` | Gerente ou responsável altera o status. |
| `GET` | `/activities/mine` | Lista as atividades atribuídas à conta atual, com o projeto. |

As listagens de atividades retornam o conjunto completo, sem paginação. Isso garante que os indicadores calculados no frontend usem todas as atividades do projeto.

## Regras aplicadas no servidor

- o criador é sempre o gerente do projeto;
- gerente e membros acessam apenas os projetos aos quais estão vinculados;
- o papel global `ADMIN` não concede acesso implícito a projetos de terceiros;
- somente o gerente altera o projeto, a equipe e os dados das atividades;
- associações duplicadas são rejeitadas;
- o gerente não é duplicado como membro e não pode ser removido;
- uma conta só pode ser responsável se for gerente ou membro do mesmo projeto;
- o responsável é opcional;
- a atividade precisa pertencer ao projeto informado na rota;
- somente gerente ou responsável altera o status;
- um membro com qualquer atividade atribuída só pode ser removido depois que o gerente reatribuir essas atividades ou deixá-las sem responsável.

Status aceitos:

- projeto: `PLANEJADO`, `EM_ANDAMENTO`, `CONCLUIDO`;
- atividade: `A_FAZER`, `EM_ANDAMENTO`, `CONCLUIDA`;
- prioridade: `BAIXA`, `MEDIA`, `ALTA`.

Os campos obrigatórios, limites, enums, identificadores, formato das datas e ordem entre início e término são validados com Zod.

## SQLite

O banco padrão é `backend/data/gestor-tech.sqlite`. Ele é criado por `npm run db:init` ou na inicialização da API e permanece disponível após recarregar o navegador ou reiniciar o servidor.

Para listar tabelas e contas sem expor hashes:

```powershell
npm run db:info
```

Em desenvolvimento, `DATABASE_SYNCHRONIZE=true` cria as tabelas `users`, `projects`, `project_members` e `activities`. Em produção, use migrações e `DATABASE_SYNCHRONIZE=false`.

## Scripts de qualidade

```powershell
npm run type-check
npm test
npm run build
```

`npm test` compila o backend e cria um banco SQLite temporário fora do banco de desenvolvimento. A suíte cobre o fluxo principal com duas contas, papel contextual entre projetos, duplicidade de membros, responsável inválido, isolamento de uma terceira conta, restrições do membro, autenticação, `ADMIN` sem vínculo e persistência após reabrir a conexão.

## Organização

```text
src/
├── config/         # ambiente
├── controllers/    # validação e HTTP
├── database/       # DataSource do TypeORM
├── entities/       # User, Project, ProjectMember e Activity
├── errors/         # erros de aplicação
├── middlewares/    # autenticação e tratamento de erros
├── routes/         # rotas REST
├── scripts/        # inicialização e inspeção do banco
├── services/       # regras de negócio e autorização
└── types/          # extensões do Express
```

Histórico de eventos, exclusão de projetos, notificações e demais evoluções descritas na proposta não fazem parte deste MVP.
