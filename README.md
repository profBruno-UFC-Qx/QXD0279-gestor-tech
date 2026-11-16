# Gestor Tech

Aplicação web para pequenas equipes organizarem projetos, participantes e atividades. O MVP descrito em [`PROPOSTA.md`](PROPOSTA.md) está integrado de ponta a ponta: uma conta cria um projeto, adiciona outra conta, atribui uma atividade e acompanha no dashboard a conclusão feita pelo responsável.

Os dados são persistidos em SQLite pelo backend. O frontend não usa mocks nem armazenamento local para projetos, equipes ou atividades; o `localStorage` guarda somente a sessão JWT.

## Tecnologias

- frontend: Vue 3, TypeScript, Vite, Vue Router e Pinia;
- backend: Express, TypeScript, TypeORM, SQLite (`better-sqlite3`), JWT, bcrypt e Zod;
- testes: Node Test Runner no backend e Vitest no frontend;
- integração contínua: GitHub Actions para tipos, testes e builds, além dos checks acadêmicos existentes.

## Requisitos

- Node.js `^22.18.0` ou `>=24.12.0`;
- npm.

## Executando localmente

Prepare o backend no primeiro terminal:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run db:init
npm run dev
```

No Bash, substitua `Copy-Item .env.example .env` por `cp .env.example .env`.

A API será iniciada em `http://localhost:8080` e usará, por padrão, `backend/data/gestor-tech.sqlite`. O TypeORM cria e sincroniza as tabelas na primeira execução sem apagar os dados existentes.

Inicie o frontend em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Demonstração com duas contas

1. Em uma janela normal, cadastre `gerente.demo@example.com` e crie um projeto.
2. Em uma janela anônima ou outro navegador, cadastre `membro.demo@example.com`.
3. Volte à conta gerente, abra **Equipe** e adicione `membro.demo@example.com`.
4. Abra **Atividades**, crie uma atividade e selecione a segunda conta como responsável.
5. Na segunda janela, abra **Minhas atividades** e marque a atividade como concluída.
6. Na conta gerente, recarregue o dashboard: total, concluídas, pendentes, atrasadas e percentual de conclusão serão recalculados com todas as atividades do projeto.
7. Recarregue ambas as páginas ou reinicie o backend para confirmar que projeto, vínculo e atividade continuam no SQLite.

Os papéis são contextuais. A mesma conta pode ser gerente de um projeto e membro de outro. Os papéis globais `ADMIN` e `USER` são preservados na autenticação, mas `ADMIN` não recebe acesso automático a projetos de terceiros.

## Verificações

Backend:

```powershell
cd backend
npm run type-check
npm test
npm run build
```

Frontend:

```powershell
cd frontend
npm run type-check
npm test
npm run build
```

Os testes de integração do backend usam um arquivo SQLite temporário e isolado. O teste percorre autenticação, projeto, equipe, atividades, permissões, conclusão pela segunda conta e reabertura da conexão para validar persistência. Os testes do frontend validam as regras dos indicadores do dashboard.

## Estrutura

```text
.
├── frontend/              # interface Vue e clientes da API REST
├── backend/               # API Express, regras de acesso e SQLite
├── .github/workflows/     # checks acadêmicos e qualidade do MVP
├── ESTADO_ATUAL.md        # retrato técnico e decisões
├── PROPOSTA.md            # escopo do produto
└── ENTREGA.md             # roteiro e matriz da entrega
```

Consulte [`backend/README.md`](backend/README.md) para o contrato REST, regras de autorização e configuração do banco.
