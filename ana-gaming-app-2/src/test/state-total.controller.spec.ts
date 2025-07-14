import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestException } from '@nestjs/common';
import { StateTotalService } from '../application/state-total.service';
import { StateTotalConsumer } from '../interfaces/controllers/state-total.consumer';

describe('StateTotalConsumer', () => {
  let consumer: StateTotalConsumer;
  let service: StateTotalService;

  beforeEach(async () => {
    const serviceMock = {
      processBatch: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateTotalConsumer],
      providers: [{ provide: StateTotalService, useValue: serviceMock }],
    }).compile();

    consumer = module.get<StateTotalConsumer>(StateTotalConsumer);
    service = module.get<StateTotalService>(StateTotalService);
  });

  it('should throw BadRequestException if batch is invalid', async () => {
    await expect(consumer.handleBatch([])).rejects.toThrow(BadRequestException);
  });

  it('should call service and return success message', async () => {
    const batch = [{ id: 1, name: 'A', phone: '123', state: 'SP' }];
    (service.processBatch as jest.Mock).mockResolvedValue(undefined);

    const result = await consumer.handleBatch(batch);

    expect(service.processBatch).toHaveBeenCalledWith(batch);
    expect(result).toEqual({ message: 'Batch processado com sucesso' });
  });

  it('should log error and rethrow if service throws', async () => {
    const batch = [{ id: 1, name: 'A', phone: '123', state: 'SP' }];
    const error = new Error('Service error');
    (service.processBatch as jest.Mock).mockRejectedValue(error);

    const errorSpy = jest.spyOn(consumer['logger'], 'error').mockImplementation(() => {});

    await expect(consumer.handleBatch(batch)).rejects.toThrow(error);
    expect(errorSpy).toHaveBeenCalledWith('Erro ao processar batch', error);

    errorSpy.mockRestore();
  });
});
