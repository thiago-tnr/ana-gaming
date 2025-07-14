import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import * as fs from 'fs';
import { CsvReaderService } from '../csv/csv-reader.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Logger } from '@nestjs/common';
import { BatchProcessorProducerService } from '../csv/batch-processor-producer.service';
import { ClientProxy } from '@nestjs/microservices';

describe('CsvReaderService', () => {
  let service: CsvReaderService;
  let batchProcessor: BatchProcessorProducerService;

  beforeEach(async () => {
    // Mock do HttpService
    const httpServiceMock = {
      post: jest.fn().mockReturnValue(of({ status: 201 })),
    };

    // Mock do RabbitMQ ClientProxy
    const rabbitmqMock: Partial<ClientProxy> = {
      emit: jest.fn().mockReturnValue(of(undefined)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsvReaderService,
        BatchProcessorProducerService,
        { provide: HttpService, useValue: httpServiceMock },
        { provide: 'RABBITMQ_SERVICE', useValue: rabbitmqMock },
      ],
    }).compile();

    service = module.get<CsvReaderService>(CsvReaderService);
    batchProcessor = module.get<BatchProcessorProducerService>(
      BatchProcessorProducerService,
    );

    // 🟢 Espiona e mocka o método que será verificado no teste
    jest
      .spyOn(batchProcessor, 'sendInBatchesProducer')
      .mockResolvedValue(undefined);

    // Opcional: suprime logs de erro no console
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should process valid CSV and send batches', async () => {
    const testCsvPath = path.resolve(__dirname, 'test-files', 'valid.csv');
    await service.processCsvAndSendBatches(testCsvPath);
    expect(batchProcessor.sendInBatchesProducer).toHaveBeenCalled();
  });

  it('should skip invalid records and log warnings', async () => {
    const testCsvPath = path.resolve(__dirname, 'test-files', 'invalid.csv');
    const warnSpy = jest.spyOn(service['logger'], 'warn');
    await service.processCsvAndSendBatches(testCsvPath);
    expect(warnSpy).toHaveBeenCalled();
    expect(batchProcessor.sendInBatchesProducer).toHaveBeenCalled();
  });

  it('should reject promise on file read error', async () => {
    jest.spyOn(fs, 'createReadStream').mockImplementation(() => {
      throw new Error('File not found');
    });

    await expect(
      service.processCsvAndSendBatches('non-existent-file.csv'),
    ).rejects.toThrow('File not found');
  });
});
