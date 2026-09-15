# :checkered_flag: NOME DO PROJETO

# Gestor Tech

O **Gestor Tech** é uma aplicação web voltada para o gerenciamento de projetos de desenvolvimento de software. A plataforma permite que gerentes de projetos planejem cronogramas, organizem atividades da equipe, acompanhem o progresso das entregas e visualizem indicadores sobre o andamento dos projetos.

A aplicação busca centralizar informações importantes do projeto em um único ambiente, facilitando o acompanhamento de prazos, responsabilidades e atividades, reduzindo problemas relacionados à comunicação e controle das tarefas.

---

## :technologist: Membros da equipe

- Matrícula: 554973 — Pedro Lucas Silva dos Santos — Ciência da Computação

---

## :bulb: Objetivo Geral

Desenvolver uma aplicação web para auxiliar gerentes de projetos no planejamento, organização e acompanhamento de projetos de software, permitindo o gerenciamento de cronogramas, atividades, equipes e indicadores de progresso.

---

## :eyes: Público-Alvo

O público-alvo do Gestor Tech são:

- Gerentes de projetos de software;
- Pequenas equipes de desenvolvimento;
- Startups de tecnologia;
- Empresas que precisam acompanhar projetos internos;
- Equipes acadêmicas que desenvolvem projetos de software.

---

## :star2: Impacto Esperado

Espera-se que o Gestor Tech facilite o gerenciamento de projetos, proporcionando maior organização das atividades, melhor distribuição de tarefas e maior visibilidade sobre o andamento das entregas.

A aplicação busca auxiliar os gerentes a identificarem possíveis atrasos, acompanharem a produtividade da equipe e tomarem decisões baseadas nas informações do projeto.

Além disso, pretende reduzir a dependência de controles manuais e informações dispersas em diferentes ferramentas, criando um ambiente centralizado para acompanhamento do ciclo de desenvolvimento.

---

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

### Usuário não autenticado

Pode:

- Visualizar informações gerais sobre a plataforma;
- Realizar cadastro;
- Realizar login.

---

### Gerente de Projeto

Usuário responsável pela administração dos projetos.

Pode:

- Criar e editar projetos;
- Definir cronogramas;
- Adicionar membros à equipe;
- Criar e distribuir atividades;
- Acompanhar progresso do projeto;
- Visualizar dashboards e indicadores;
- Gerenciar riscos e prazos.

---

### Membro da Equipe

Usuário participante de um projeto.

Pode:

- Visualizar projetos nos quais está inserido;
- Consultar suas atividades;
- Atualizar status das tarefas;
- Registrar observações sobre atividades;
- Acompanhar prazos de suas entregas.

---

## :triangular_flag_on_post: Principais funcionalidades da aplicação

### Funcionalidades acessíveis a todos os usuários

- Cadastro de usuários;
- Autenticação no sistema;
- Visualização das informações básicas da plataforma.

---

### Funcionalidades restritas a usuários autenticados

### Gerenciamento de projetos

- Criar novos projetos;
- Editar informações do projeto;
- Definir período de execução;
- Alterar status do projeto.

---

### Gerenciamento de equipe

- Adicionar membros ao projeto;
- Definir participantes responsáveis por atividades;
- Visualizar integrantes da equipe.

---

### Gerenciamento de atividades

- Criar tarefas;
- Definir responsável;
- Definir prioridade;
- Estabelecer prazo;
- Alterar status da atividade.

Exemplo de fluxo:

- A fazer;
- Em andamento;
- Concluído.

---

### Cronograma do projeto

- Criar etapas do projeto;
- Definir datas de início e término;
- Visualizar evolução das atividades;
- Acompanhar entregas previstas.

---

### Dashboard de acompanhamento

- Visualizar percentual de conclusão;
- Quantidade de tarefas concluídas e pendentes;
- Identificar atividades atrasadas;
- Acompanhar progresso geral do projeto.

---

### Gestão de riscos

- Registrar possíveis riscos do projeto;
- Definir impacto e prioridade;
- Acompanhar situação dos riscos identificados.

---

## :spiral_calendar: Entidades ou tabelas do sistema

### Usuário

Armazena informações dos usuários cadastrados.

Atributos principais:

- id;
- nome;
- email;
- senha;
- tipo de usuário.

---

### Projeto

Representa um projeto gerenciado dentro da plataforma.

Atributos principais:

- id;
- nome;
- descrição;
- data de início;
- data de término;
- status;
- gerente responsável.

---

### EquipeProjeto

Relaciona usuários aos projetos.

Atributos principais:

- id;
- usuário_id;
- projeto_id;
- função no projeto.

---

### Atividade

Representa as tarefas que precisam ser realizadas.

Atributos principais:

- id;
- título;
- descrição;
- prioridade;
- status;
- prazo;
- responsável;
- projeto_id.

---

### Cronograma

Armazena as etapas e períodos planejados do projeto.

Atributos principais:

- id;
- projeto_id;
- etapa;
- data inicial;
- data final;
- progresso.

---

### Risco

Representa riscos identificados durante o projeto.

Atributos principais:

- id;
- descrição;
- impacto;
- probabilidade;
- status;
- projeto_id.

---

### Comentário

Permite comunicação entre membros dentro das atividades.

Atributos principais:

- id;
- mensagem;
- data;
- usuário_id;
- atividade_id.