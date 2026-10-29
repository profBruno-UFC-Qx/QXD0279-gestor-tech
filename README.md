# Gestor Tech

Aplicação web para pequenas equipes organizarem projetos, participantes e atividades. A estrutura do repositório segue o MVP descrito em [`PROPOSTA.md`](PROPOSTA.md): autenticação, projetos, equipe, atividades e acompanhamento básico.

O retrato consolidado do que está implementado, validado e ainda pendente está em [`ESTADO_ATUAL.md`](ESTADO_ATUAL.md).

## Escopo do MVP

- cadastro, login e logout;
- criação e edição de projetos;
- inclusão e remoção de membros;
- criação, edição e exclusão de atividades;
- atualização do status pelo responsável;
- indicadores de total, concluídas, pendentes, atrasadas e percentual de conclusão.

Riscos, comentários, cronograma independente, relatórios avançados, notificações e anexos não fazem parte desta versão.

## Estrutura

```text
.
├── frontend/
│   └── src/
│       ├── components/     # componentes visuais e navegação do projeto
│       ├── layouts/        # áreas pública e autenticada
│       ├── router/         # rotas públicas e protegidas
│       ├── services/       # persistência e regras da simulação local
│       ├── stores/         # sessão do usuário
│       ├── types/          # Usuário, Projeto, MembroProjeto e Atividade
│       ├── utils/          # rótulos e formatação
│       └── views/          # autenticação, projetos e atividades
├── backend/                # espaço reservado para a API Strapi
├── ESTADO_ATUAL.md
├── PROPOSTA.md
└── ENTREGA.md
```

O papel do usuário é contextual: ele pode ser gerente de um projeto e membro de outro. Por isso, não existe um campo global de perfil no tipo `User`; as permissões são verificadas com base no projeto atual.

## Executando o frontend

Requisitos: Node.js `^22.18.0` ou `>=24.12.0` e npm.

```bash
cd frontend
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
```

Nesta etapa, o frontend é executável sem API. Autenticação, projetos, equipe e atividades são simulados e persistidos no `localStorage` do navegador. O diretório `backend/` continua reservado à implementação futura da API e não participa da execução atual.
