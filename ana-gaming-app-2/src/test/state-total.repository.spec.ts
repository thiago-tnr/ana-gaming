import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StateTotalRepository } from '../interfaces/mongodb/state-total.repository';

describe('StateTotalRepository', () => {
  let repository: StateTotalRepository;
  let model: Model<any>;

  const execMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateTotalRepository,
        {
          provide: getModelToken('StateTotalDocument'),
          useValue: {
            updateOne: jest.fn(() => ({ exec: execMock })),
          },
        },
      ],
    }).compile();

    repository = module.get<StateTotalRepository>(StateTotalRepository);
    model = module.get<Model<any>>(getModelToken('StateTotalDocument'));

    execMock.mockClear();
    (model.updateOne as jest.Mock).mockClear();
  });

  it('should increment totalPeople for a given state', async () => {
    execMock.mockResolvedValue({ acknowledged: true });

    await repository.incrementTotalPeople('SP', 5);

    expect(model.updateOne).toHaveBeenCalledWith(
      { state: 'SP' },
      { $inc: { totalPeople: 5 } },
      { upsert: true },
    );
    expect(execMock).toHaveBeenCalled();
  });

  it('should log error and throw if updateOne fails', async () => {
    const error = new Error('Mongo error');
    execMock.mockRejectedValue(error);
    const loggerSpy = jest.spyOn(repository['logger'], 'error').mockImplementation(() => {});

    await expect(repository.incrementTotalPeople('RJ', 3)).rejects.toThrow('Mongo error');

    expect(loggerSpy).toHaveBeenCalledWith(
      'Erro ao incrementar total para estado RJ',
      error,
    );

    loggerSpy.mockRestore();
  });
});
