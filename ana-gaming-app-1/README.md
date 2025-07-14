# Aplicação 1 - Leitura e Envio de Dados em Batch (Producer)

Esta aplicação tem como objetivo ler um arquivo CSV contendo milhares de registros, processar os dados em batches e enviá-los para a segunda aplicação via fila (RabbitMQ).

## 📁 Estrutura do Projeto

- `CsvReaderService`: Responsável por ler o arquivo CSV, tratar os dados e criar os batches.
- `BatchProcessorService`: Envia os batches para a API da segunda aplicação.
- `csv.controller.ts`: Possui a rota para receber o arquivo CSV e iniciar o processo via HTTP (ex: `/csv/process`).

## 🚀 Funcionalidades

- Leitura eficiente com `fs.createReadStream` e `csv-parser`.
- Processamento de dados com validações para ignorar registros inválidos.
- Divisão em batches de 1000 registros.
- Delay configurável para respeitar limite de 1000 registros/segundo.
- Envio HTTP de cada batch para a aplicação consumidora.

## ⚙️ Variáveis de Ambiente

Configure as variáveis no `.env`:

```env
BATCH_SIZE=1000
SEND_DELAY_MS=1000
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
