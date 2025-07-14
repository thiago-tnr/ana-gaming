import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StateTotalService } from '../../application/state-total.service';
import { PersonDto } from '../dto/person.dto';

@Controller()
export class StateTotalConsumer {
  private readonly logger = new Logger(StateTotalConsumer.name);

  constructor(private readonly stateTotalService: StateTotalService) {}

  @EventPattern('process_batch')
  async handleBatch(@Payload() batch: PersonDto[]) {
    if (!batch || batch.length === 0) {
      throw new BadRequestException('Batch não pode ser vazio');
    }

    this.logger.log(`Received batch with ${batch.length} records`);

    try {
      await this.stateTotalService.processBatch(batch);
      return { message: 'Batch processado com sucesso' };
    } catch (error) {
      this.logger.error('Erro ao processar batch', error);
      throw error;
    }
  }
}
