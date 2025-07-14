import { Injectable, Logger } from '@nestjs/common';
import { PersonDto } from '../interfaces/dto/person.dto';
import { StateTotalRepository } from '../interfaces/mongodb/state-total.repository';
import { StateTotal } from '../domain/state-total.entity';

@Injectable()
export class StateTotalService {
  private readonly logger = new Logger(StateTotalService.name);

  constructor(private readonly repository: StateTotalRepository) {}

async processBatch(people: PersonDto[]): Promise<void> {
  try {
    const stateTotals = new Map<string, StateTotal>();

    for (const person of people) {
      if (!person.state) {
        this.logger.warn(`Pessoa sem estado: ${JSON.stringify(person)}`);
        continue;
      }

      const existing = stateTotals.get(person.state);

      if (existing) {
        existing.addPeople(1);
      } else {
        stateTotals.set(person.state, new StateTotal(person.state, 1));
      }
    }

    const updates = Array.from(stateTotals.values()).map((stateTotal) =>
      this.repository.incrementTotalPeople(stateTotal.state, stateTotal.totalPeople),
    );

    await Promise.all(updates);

    this.logger.log(
      `Batch processado para estados: ${Array.from(stateTotals.keys()).join(', ')}`,
    );
  } catch (error) {
    this.logger.error('Erro inesperado ao processar batch', error);
    throw error;
  }
}
}
