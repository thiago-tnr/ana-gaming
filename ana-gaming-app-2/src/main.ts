import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://admin:admin@localhost:5672'],
      queue: 'csv_batches_queue',
      queueOptions: {
        durable: false,
      },
    },
  }
  );
  await app.listen();
  console.log('Aplicação 2 rodando em http://localhost:3001');
}

bootstrap().catch((error) => {
  console.error('Erro no bootstrap:', error);
  process.exit(1);
});
