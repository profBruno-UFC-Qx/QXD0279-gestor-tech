# Frontend — Gestor Tech

Aplicação Vue responsável pela interface do Gestor Tech. A base atual oferece tela de login, estado de autenticação com Pinia, proteção de rotas e cliente HTTP preparado para uma futura API REST.

## Requisitos

- Node.js `^22.18.0` ou `>=24.12.0`;
- npm.

## Configuração

Instale as dependências:

```bash
npm install
```

Crie o arquivo local de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Variável disponível:

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da futura API REST | `http://localhost:8080` |

Variáveis prefixadas com `VITE_` são incorporadas ao frontend e não devem armazenar segredos.

## Desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Esse comando executa a checagem de tipos e gera os arquivos otimizados em `dist/`.

## Integração futura

O cliente HTTP está centralizado em `src/services/api.ts`. O login espera uma API com:

```text
POST /auth/login
```

Resposta esperada:

```json
{
  "token": "token-de-acesso",
  "user": {
    "id": 1,
    "name": "Nome do usuário",
    "email": "usuario@exemplo.com",
    "role": "MANAGER"
  }
}
```

Até a implementação do backend, tentativas de login apresentarão uma mensagem de indisponibilidade do servidor.
