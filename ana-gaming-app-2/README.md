# Aplicação 2 – Recepção e Armazenamento de Dados (Consumer)

Esta aplicação atua como **consumidora de mensagens via RabbitMQ**, recebendo os batches enviados pela Aplicação 1. Seu papel é agregar os dados, somando a quantidade total de pessoas por estado, e armazenar as informações no MongoDB.

---

## 📁 Estrutura do Projeto

- `StateTotalConsumer`: Microserviço que escuta a fila `csv_batches_queue` e processa os batches recebidos.
- `StateTotalService`: Contém a lógica de agregação e armazenamento dos dados por estado.
- `StateDocument`: Modelo Mongoose responsável por representar os dados de estado e total de pessoas no banco.
- `CsvConsumer`: (Legado ou nome alternativo) Responsável por receber os dados da fila, delegando ao serviço.

---

## 🚀 Funcionalidades

- Consome batches de pessoas via fila RabbitMQ (`process_batch`).
- Agrega dados por estado e atualiza os totais.
- Persiste os dados no MongoDB.
- Alta performance com suporte a grandes volumes de dados.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes configurações:

```env
MONGO_URI=mongodb://localhost:27017/personDb
```
## 📦 Instalação
- Antes de rodar, instale as dependências:

```bash
npm install
```

## 🧪 Testes

```bash
npm run test
```

## ▶️ Rodar No Ambiente Local (com docker-compose) - Build & Run

```bash
docker-compose up -d
npm run start:dev
```

## ✅ Considerações Finais

- O CSV com 10 mil registros está em `support/dataset.csv`.
- Ambas aplicações seguem DDD, SOLID, e estão preparadas para ambientes escaláveis (como AWS).
- Toda a comunicação entre produtor e consumidor é feita por RabbitMQ com controle de taxa.
