import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { BatchProcessorProducerService } from '../csv/batch-processor-producer.service';
import { ClientProxy } from '@nestjs/microservices';

process.env.BATCH_SIZE = '1000';
process.env.SEND_DELAY_MS = '1000';

describe('BatchProcessorProducerService', () => {
  let service: BatchProcessorProducerService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpService: HttpService;

  beforeEach(async () => {
    const rabbitmqMock: Partial<ClientProxy> = {
      emit: jest.fn().mockReturnValue(of(undefined)), // CORRIGIDO
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BatchProcessorProducerService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: 'RABBITMQ_SERVICE',
          useValue: rabbitmqMock,
        },
      ],
    }).compile();

    service = module.get<BatchProcessorProducerService>(
      BatchProcessorProducerService,
    );
    httpService = module.get<HttpService>(HttpService);

    jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send data in batches respecting batch size and delay', async () => {
    jest.setTimeout(10000);

    const data = Array(2500)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: `Person ${i + 1}`,
        phone: '0000-0000',
        state: 'SP',
      }));

    // Confirma que emit é um mock observável
    const emitMock = jest
      .spyOn(service['client'], 'emit')
      .mockReturnValue(of(undefined));

    await service.sendInBatchesProducer(data);

    expect(emitMock).toHaveBeenCalledTimes(3); // 2500 itens / 1000 = 3 batches

    const firstCallArg: any = emitMock.mock.calls[0][1];
    expect(firstCallArg.length).toBe(1000);
  });

  it('should throw and log error if emit fails', async () => {
    const error = new Error('Network Error');

    jest
      .spyOn(service['client'], 'emit')
      .mockReturnValue(throwError(() => error));

    const data = [{ id: 1, name: 'Person 1', phone: '0000-0000', state: 'SP' }];

    await expect(service.sendInBatchesProducer(data)).rejects.toThrow(
      'Network Error',
    );
  });
});
