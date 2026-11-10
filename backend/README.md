# Contrato REST esperado pelo frontend

O backend ainda será implementado. Este documento registra o contrato que o frontend já consome, evitando que a integração dependa de dados mockados ou de alterações espalhadas pelas telas.

## Convenções

- URL base configurada no frontend por `VITE_API_URL`;
- corpo e resposta em JSON, sem envelope `data`;
- autenticação com `Authorization: Bearer <token>`;
- datas simples no formato `YYYY-MM-DD` e instantes em ISO 8601;
- exclusões bem-sucedidas podem responder `204 No Content`;
- erros devem usar um status HTTP adequado e, preferencialmente, `{ "message": "Descrição legível" }`;
- o CORS deve permitir a origem em que o frontend estiver sendo executado.

Se o backend for construído com Strapi e mantiver o prefixo `/api`, configure, por exemplo, `VITE_API_URL=http://localhost:1337/api`.

## Endpoints

| Método | Endpoint | Entrada | Resposta |
|---|---|---|---|
| `POST` | `/auth/register` | `{ nome, email, senha }` | `AuthResponse` |
| `POST` | `/auth/login` | `{ email, senha }` | `AuthResponse` |
| `GET` | `/auth/me` | — | `User` |
| `GET` | `/projects` | — | `Project[]` |
| `POST` | `/projects` | `ProjectPayload` | `Project` |
| `GET` | `/projects/:id` | — | `Project` |
| `PUT` | `/projects/:id` | `ProjectPayload` | `Project` |
| `GET` | `/projects/:id/members` | — | `ProjectMember[]` |
| `POST` | `/projects/:id/members` | `{ email }` | `ProjectMember` |
| `DELETE` | `/projects/:id/members/:memberId` | — | `204` |
| `GET` | `/projects/:id/activities` | — | `Activity[]` |
| `POST` | `/projects/:id/activities` | `ActivityPayload` | `Activity` |
| `PUT` | `/projects/:id/activities/:activityId` | `ActivityPayload` | `Activity` |
| `PATCH` | `/projects/:id/activities/:activityId/status` | `{ status }` | `Activity` |
| `DELETE` | `/projects/:id/activities/:activityId` | — | `204` |
| `GET` | `/activities/mine` | — | `Activity[]` |
| `GET` | `/projects/:id/events` | — | `ProjectEvent[]` |

## Formatos de resposta

```ts
interface User {
  id: number
  nome: string
  email: string
}

interface AuthResponse {
  token: string
  user: User
}

interface Project {
  id: number
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
  status: 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO'
  gerenteId: number
  gerente: { id: number; nome: string }
  papelAtual: 'GERENTE' | 'MEMBRO'
}

type ProjectPayload = Pick<
  Project,
  'nome' | 'descricao' | 'dataInicio' | 'dataFim' | 'status'
>

interface ProjectMember {
  id: number
  usuarioId: number
  projetoId: number
  usuario: User
}

interface Activity {
  id: number
  titulo: string
  descricao: string
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA'
  status: 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDA'
  prazo: string
  responsavelId: number | null
  projetoId: number
  responsavel: User | null
  projeto?: { id: number; nome: string }
}

type ActivityPayload = Pick<
  Activity,
  'titulo' | 'descricao' | 'prioridade' | 'status' | 'prazo' | 'responsavelId'
>

interface ProjectEvent {
  id: number
  projectId: number
  actorId: number | null
  actorName: string
  type:
    | 'project-created'
    | 'project-updated'
    | 'activity-created'
    | 'activity-updated'
    | 'activity-status'
    | 'activity-deleted'
    | 'member-added'
    | 'member-removed'
  message: string
  createdAt: string
}
```

Em `/activities/mine`, cada atividade deve incluir `projeto`, pois essa tela agrega tarefas de projetos diferentes. As respostas de projeto devem incluir `gerente` e `papelAtual`; o frontend usa esses dados para apresentar as ações adequadas.

## Regras que pertencem ao servidor

- autenticar credenciais e emitir/validar o token;
- retornar somente projetos dos quais o usuário participa;
- definir o criador como gerente do projeto;
- permitir edição do projeto e gestão de equipe/atividades somente ao gerente;
- permitir a mudança de status ao gerente ou responsável da atividade;
- aceitar como responsável apenas o gerente ou um membro do mesmo projeto;
- ao remover um membro, remover também suas atribuições no projeto;
- criar os eventos de auditoria no servidor, nunca a partir de texto enviado pelo cliente.
