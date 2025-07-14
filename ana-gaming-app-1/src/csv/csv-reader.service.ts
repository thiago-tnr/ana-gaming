import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PersonDto } from './dto/person.dto';
import { Person } from './types/person.interface';
import { BatchProcessorProducerService } from './batch-processor-producer.service';

@Injectable()
export class CsvReaderService {
  private readonly logger = new Logger(CsvReaderService.name);

  constructor(
    private readonly batchProcessorProducerService: BatchProcessorProducerService,
  ) {}

  async processCsvAndSendBatches(filePath: string): Promise<void> {
    const people: Person[] = [];

    return new Promise((resolve) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', async (data) => {
          const personDto = plainToInstance(PersonDto, {
            id: Number(data.id),
            name: data.name,
            phone: data.phone,
            state: data.state,
          });

          const errors = await validate(personDto);
          if (errors.length === 0) {
            people.push(personDto as Person);
          } else {
            this.logger.warn(`Invalid record skipped: ${JSON.stringify(data)}`);
          }
        })
        .on('end', async () => {
          this.logger.log(
            `CSV reading finished. Valid records count: ${people.length}`,
          );

          try {
            this.logger.log(people, 'people');
            await this.batchProcessorProducerService.sendInBatchesProducer(
              people,
            );
            this.logger.log('All batches sent successfully.');
            resolve();
          } catch (error) {
            this.logger.error('Error sending batches', error);
            throw error instanceof Error ? error : new Error(String(error));
          }
        })
        .on('error', (error) => {
          this.logger.error('Error reading CSV file', error);
          throw error instanceof Error ? error : new Error(String(error));
        });
    });
  }
}
