# 🧠 Ana Gaming – Processamento e Análise de CSV com RabbitMQ

Este repositório contém **duas aplicações Node.js/NestJS separadas**, organizadas em pastas distintas, que trabalham em conjunto para processar um arquivo CSV com dados de pessoas, agrupar por estado e armazenar no MongoDB.

A comunicação entre as aplicações é feita por meio de **fila RabbitMQ**, o que permite escalabilidade, desacoplamento e controle de fluxo.

---

## 📦 Estrutura Geral do Projeto

```bash
ana-gaming/
├── ana-gaming-app-1/   # 🟢 Produtor - Lê CSV e envia em lotes via RabbitMQ
├── ana-gaming-app-2/   # 🟠 Consumidor - Recebe lotes e agrupa por estado
└── README.md           # (este arquivo)
```

---

## 🔍 Visão Geral

| Aplicação | Função Principal | Stack | Docs |
|----------|------------------|-------|------|
| [`ana-gaming-app-1`](./ana-gaming-app-1) | Lê o CSV, separa em batches e envia via RabbitMQ | NestJS, CSV-parser, RabbitMQ | 📄 [`README.md`](./ana-gaming-app-1/README.md) |
| [`ana-gaming-app-2`](./ana-gaming-app-2) | Consome os batches, agrega por estado e armazena no MongoDB | NestJS, Mongoose, RabbitMQ | 📄 [`README.md`](./ana-gaming-app-2/README.md) |

---

## 🚀 Como Executar Localmente

### Pré-requisitos:

- [Node.js](https://nodejs.org/) (v18+ recomendado)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- RabbitMQ e MongoDB sobem via Docker

### Passo 1: Clone o projeto

```bash
git clone https://github.com/thiago-tnr/ana-gaming.git
cd ana-gaming
```

### Passo 2: Suba as dependências (Mongo + RabbitMQ)

```bash
docker-compose up -d
```

### Passo 3: Inicie as aplicações separadamente

#### App 1 – Produtor

```bash
cd ana-gaming-app-1
npm install
npm run start:dev
```

#### App 2 – Consumidor

```bash
cd ana-gaming-app-2
npm install
npm run start:dev
```

---

## 🧪 Testes

Cada aplicação possui seus próprios testes unitários. Siga as instruções dentro de cada pasta:

- [`ana-gaming-app-1/README.md`](./ana-gaming-app-1/README.md)
- [`ana-gaming-app-2/README.md`](./ana-gaming-app-2/README.md)

---

## 📁 Dados de Exemplo

O arquivo `support/dataset.csv` contém 10 mil registros fictícios utilizados para testes de carga e processamento em lote.

---

## 📌 Observações Finais

- Projeto dividido por contexto (producer x consumer) para facilitar escalabilidade.
- Arquitetura pensada para mensageria, desacoplamento e alta performance.
- Segue boas práticas como DDD, SOLID e modularização.

---

👨‍💻 Desenvolvido por [Thiago Rocha](https://github.com/thiago-tnr)
