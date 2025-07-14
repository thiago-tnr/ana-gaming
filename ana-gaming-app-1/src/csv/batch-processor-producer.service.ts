// batch-processor.service.ts (App1)
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Person } from './types/person.interface';

@Injectable()
export class BatchProcessorProducerService {
  private readonly logger = new Logger(BatchProcessorProducerService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendInBatchesProducer(data: Person[]): Promise<void> {
    for (let i = 0; i < data.length; i += Number(process.env.BATCH_SIZE)) {
      const batch = data.slice(i, i + Number(process.env.BATCH_SIZE));
      try {
        await lastValueFrom(this.client.emit('process_batch', batch));
        this.logger.log(`Batch ${i / 1000 + 1} sent.`);
      } catch (error) {
        this.logger.error('Error sending batch', error);
        throw error;
      }
      await new Promise((res) =>
        setTimeout(res, Number(process.env.SEND_DELAY_MS)),
      ); // respeitar limite
    }
  }
}
