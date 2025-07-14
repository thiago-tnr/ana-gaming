import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StateTotalDocument } from './state-total.schema';

@Injectable()
export class StateTotalRepository {
  private readonly logger = new Logger(StateTotalRepository.name);

  constructor(
    @InjectModel(StateTotalDocument.name)
    private readonly stateTotalModel: Model<StateTotalDocument>,
  ) {}

  async incrementTotalPeople(state: string, count: number): Promise<void> {
    try {
      await this.stateTotalModel
        .updateOne(
          { state },
          { $inc: { totalPeople: count } },
          { upsert: true },
        )
        .exec();
    } catch (error) {
      this.logger.error(
        `Erro ao incrementar total para estado ${state}`,
        error,
      );
      throw error;
    }
  }
}
