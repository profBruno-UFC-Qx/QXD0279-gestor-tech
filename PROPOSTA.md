# 🏁 Gestor Tech

O **Gestor Tech** é uma aplicação web voltada para o gerenciamento de projetos de desenvolvimento de software.

A plataforma permite que pequenas equipes organizem seus projetos, membros e atividades em um único ambiente, facilitando a distribuição de tarefas e o acompanhamento do progresso das entregas.

O sistema busca oferecer uma solução simples e centralizada para equipes que precisam controlar responsabilidades, prazos e andamento das atividades de um projeto de software.

---

## 👨‍💻 Membros da equipe

- **Matrícula:** 554973
- **Aluno:** Pedro Lucas Silva dos Santos
- **Curso:** Ciência da Computação

---

## 💡 Objetivo Geral

Desenvolver uma aplicação web para auxiliar pequenas equipes de desenvolvimento de software no gerenciamento de projetos e atividades, permitindo organizar membros, distribuir tarefas e acompanhar o progresso das entregas.

---

## 👀 Público-Alvo

O Gestor Tech é voltado principalmente para:

- Gerentes e responsáveis por projetos de software;
- Pequenas equipes de desenvolvimento;
- Startups de tecnologia;
- Equipes acadêmicas;
- Grupos que desenvolvem projetos de software de pequeno e médio porte.

---

## 🌟 Impacto Esperado

Espera-se que o Gestor Tech facilite a organização e o acompanhamento de projetos de software, centralizando informações relacionadas às atividades, aos responsáveis e aos prazos.

A aplicação busca proporcionar maior visibilidade sobre o andamento das tarefas e permitir que os responsáveis pelo projeto identifiquem atividades pendentes, concluídas ou atrasadas.

Além disso, pretende reduzir a dependência de controles manuais e informações dispersas, oferecendo um ambiente único para o acompanhamento das principais informações do projeto.

---

## 👥 Papéis dos usuários

### Usuário não autenticado

Pode:

- Visualizar informações gerais sobre a plataforma;
- Criar uma conta;
- Realizar login.

---

### Gerente do Projeto

É o usuário responsável pela administração de determinado projeto.

Pode:

- Criar projetos;
- Editar projetos;
- Visualizar projetos sob sua responsabilidade;
- Alterar o status de projetos;
- Adicionar membros ao projeto;
- Remover membros do projeto;
- Criar atividades;
- Editar atividades;
- Excluir atividades;
- Definir responsáveis por atividades;
- Definir prioridade e prazo das atividades;
- Acompanhar o progresso do projeto;
- Visualizar indicadores relacionados às atividades.

> O papel de gerente está relacionado ao projeto e não necessariamente ao usuário de forma global. Um usuário pode ser gerente de um projeto e membro de outro.

---

### Membro do Projeto

É um usuário participante de um ou mais projetos.

Pode:

- Visualizar os projetos dos quais participa;
- Visualizar as atividades do projeto;
- Consultar as atividades pelas quais é responsável;
- Atualizar o status das próprias atividades;
- Acompanhar os prazos de suas tarefas.

---

# 🚩 Principais funcionalidades

## Funcionalidades públicas

### Cadastro

Permite que novos usuários criem uma conta na plataforma.

### Login

Permite que usuários cadastrados realizem autenticação no sistema.

### Logout

Permite encerrar a sessão do usuário.

---

# 🔐 Funcionalidades autenticadas

## 📁 Gerenciamento de Projetos

O gerente poderá:

- Criar novos projetos;
- Editar informações do projeto;
- Visualizar detalhes do projeto;
- Definir data de início;
- Definir data de término;
- Alterar o status do projeto.

### Status possíveis

- Planejado;
- Em andamento;
- Concluído.

---

## 👥 Gerenciamento da Equipe

O gerente poderá:

- Adicionar usuários cadastrados ao projeto;
- Visualizar os integrantes da equipe;
- Remover membros do projeto.

Cada projeto possuirá um gerente responsável e poderá possuir diversos membros.

---

## ✅ Gerenciamento de Atividades

Dentro de cada projeto será possível criar e administrar atividades.

Cada atividade poderá possuir:

- Título;
- Descrição;
- Responsável;
- Prioridade;
- Status;
- Prazo.

### Prioridades

- Baixa;
- Média;
- Alta.

### Status das atividades

- A fazer;
- Em andamento;
- Concluída.

O fluxo principal será:

```text
A fazer → Em andamento → Concluída
```

O gerente poderá criar, editar e excluir atividades.

Os membros poderão atualizar o status das atividades pelas quais são responsáveis.

---

## 📊 Dashboard de Acompanhamento

Cada projeto possuirá uma área de acompanhamento com indicadores gerados a partir das atividades cadastradas.

Serão apresentados indicadores como:

- Quantidade total de atividades;
- Quantidade de atividades concluídas;
- Quantidade de atividades pendentes;
- Quantidade de atividades atrasadas;
- Percentual de conclusão do projeto.

### Exemplo

```text
Progresso do Projeto

██████████████░░░░░░ 70%

Total de atividades: 10
Concluídas: 7
Pendentes: 3
Atrasadas: 1
```

O percentual de conclusão poderá ser calculado utilizando:

```text
Percentual de conclusão =
(quantidade de atividades concluídas / quantidade total de atividades) × 100
```

Uma atividade será considerada atrasada quando:

```text
prazo < data atual
AND
status != CONCLUÍDA
```

---

# 🔄 Fluxo principal da aplicação

O fluxo esperado de utilização do Gestor Tech será:

```text
Cadastro/Login
      ↓
Criação do Projeto
      ↓
Adição de Membros
      ↓
Criação de Atividades
      ↓
Distribuição das Atividades
      ↓
Atualização dos Status
      ↓
Acompanhamento do Progresso
```

### Exemplo

1. Um usuário realiza cadastro e login;
2. O usuário cria um projeto;
3. O criador torna-se gerente do projeto;
4. O gerente adiciona outros usuários ao projeto;
5. O gerente cria atividades;
6. Define responsáveis, prioridades e prazos;
7. Os membros visualizam suas atividades;
8. Os membros atualizam o andamento das tarefas;
9. O gerente acompanha o progresso através do dashboard.

---

# 🗃️ Entidades do Sistema

O sistema será composto inicialmente por quatro entidades principais:

```text
Usuário
   │
   │
   ├───────────────┐
   │               │
   ▼               ▼
Projeto ◄──── MembroProjeto
   │
   │
   ▼
Atividade
```

---

## 👤 Usuário

Representa os usuários cadastrados na plataforma.

### Atributos principais

- `id`
- `nome`
- `email`
- `senha`

---

## 📁 Projeto

Representa um projeto cadastrado na plataforma.

### Atributos principais

- `id`
- `nome`
- `descricao`
- `dataInicio`
- `dataFim`
- `status`
- `gerenteId`

---

## 👥 MembroProjeto

Representa a associação entre um usuário e um projeto.

Essa entidade permite que um usuário participe de diferentes projetos.

### Atributos principais

- `id`
- `usuarioId`
- `projetoId`

---

## ✅ Atividade

Representa uma tarefa pertencente a determinado projeto.

### Atributos principais

- `id`
- `titulo`
- `descricao`
- `prioridade`
- `status`
- `prazo`
- `responsavelId`
- `projetoId`

---

# 🔗 Relacionamentos

Os principais relacionamentos do sistema serão:

```text
Usuário 1 ───── N Projeto
        gerente

Usuário N ───── N Projeto
      MembroProjeto

Projeto 1 ───── N Atividade

Usuário 1 ───── N Atividade
       responsável
```

Um usuário poderá gerenciar vários projetos.

Um projeto possuirá apenas um gerente.

Um usuário poderá participar de vários projetos, assim como um projeto poderá possuir vários membros.

Cada projeto poderá possuir várias atividades.

Cada atividade poderá possuir um usuário responsável.

---

# 📌 Regras de Negócio

Algumas das principais regras previstas são:

1. Apenas usuários autenticados poderão acessar projetos;
2. Apenas o gerente poderá editar as informações de seu projeto;
3. Apenas o gerente poderá adicionar ou remover membros;
4. Apenas o gerente poderá criar, editar ou excluir atividades;
5. O responsável por uma atividade deverá ser participante do respectivo projeto;
6. Um membro poderá visualizar apenas projetos dos quais participa;
7. Um membro poderá atualizar o status das atividades pelas quais é responsável;
8. Uma atividade com prazo vencido e que ainda não esteja concluída será considerada atrasada;
9. O progresso do projeto será calculado com base na quantidade de atividades concluídas;
10. O usuário que criar um projeto será automaticamente definido como gerente daquele projeto.

---

# 📦 Escopo do MVP

A primeira versão do Gestor Tech terá como foco:

- Cadastro de usuários;
- Autenticação;
- Gerenciamento de projetos;
- Gerenciamento de membros;
- Gerenciamento de atividades;
- Atualização do status das atividades;
- Dashboard básico de acompanhamento.

O objetivo é garantir que todas essas funcionalidades estejam completamente integradas entre frontend e backend.

---

# 🚫 Fora do Escopo Inicial

Para garantir a viabilidade do desenvolvimento dentro do período da disciplina, algumas funcionalidades da proposta original não farão parte da primeira versão.

Foram retirados do escopo inicial:

- Gestão de riscos;
- Sistema de comentários;
- Cronograma como módulo independente;
- Métricas avançadas de produtividade;
- Gráficos e relatórios avançados;
- Notificações;
- Anexos em atividades.

Essas funcionalidades poderão ser implementadas futuramente como evolução da plataforma.

---

# 🚀 Possíveis Evoluções Futuras

Após a conclusão do MVP, o sistema poderá receber novas funcionalidades, como:

- Comentários em atividades;
- Gestão de riscos;
- Cronograma visual;
- Gráfico de Gantt;
- Histórico de alterações;
- Notificações de prazos;
- Upload de arquivos;
- Relatórios;
- Métricas de produtividade;
- Filtros avançados;
- Kanban de atividades;
- Convites por e-mail;
- Diferentes níveis de permissão dentro das equipes.

---

# 🎯 Escopo Central

O Gestor Tech será desenvolvido em torno de três elementos principais:

```text
PROJETO
   │
   ├── EQUIPE
   │
   └── ATIVIDADES
          │
          ▼
     ACOMPANHAMENTO
```

Dessa forma, o projeto mantém as principais características de um sistema de gerenciamento de projetos, ao mesmo tempo em que possui um escopo compatível com o desenvolvimento completo de frontend e backend durante a disciplina.
