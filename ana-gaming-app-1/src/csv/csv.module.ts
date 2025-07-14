import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { CsvController } from './csv.controller';
import { CsvReaderService } from './csv-reader.service';
import { BatchProcessorProducerService } from './batch-processor-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'csv_batches_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [CsvController],
  providers: [CsvReaderService, BatchProcessorProducerService],
})
export class CsvModule {}
