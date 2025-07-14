import { Test, TestingModule } from '@nestjs/testing';
import { StateTotalService } from '../application/state-total.service';
import { StateTotalRepository } from '../interfaces/mongodb/state-total.repository';


describe('StateTotalService', () => {
  let service: StateTotalService;
  let repository: StateTotalRepository;

  beforeEach(async () => {
    const repositoryMock = {
      incrementTotalPeople: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateTotalService,
        { provide: StateTotalRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<StateTotalService>(StateTotalService);
    repository = module.get<StateTotalRepository>(StateTotalRepository);
  });

  it('should aggregate people count by state and call repository increment', async () => {
    const people = [
      { id: 1, name: 'A', phone: '123', state: 'SP' },
      { id: 2, name: 'B', phone: '456', state: 'RJ' },
      { id: 3, name: 'C', phone: '789', state: 'SP' },
    ];

    await service.processBatch(people);

    expect(repository.incrementTotalPeople).toHaveBeenCalledTimes(2);
    expect(repository.incrementTotalPeople).toHaveBeenCalledWith('SP', 2);
    expect(repository.incrementTotalPeople).toHaveBeenCalledWith('RJ', 1);
  });

  it('should warn if person without state', async () => {
    const people = [
      { id: 1, name: 'A', phone: '123', state: 'SP' },
      { id: 2, name: 'B', phone: '456', state: '' }, // inválido
      { id: 3, name: 'C', phone: '789', state: null },
      { id: 4, name: 'D', phone: '000', state: undefined },
    ];

    const warnSpy = jest.spyOn(service['logger'], 'warn').mockImplementation(() => {});
    await service.processBatch(people as any);

    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(repository.incrementTotalPeople).toHaveBeenCalledWith('SP', 1);

    warnSpy.mockRestore();
  });

  it('should log error and rethrow if repository throws', async () => {
    const error = new Error('Repo error');
    jest.spyOn(repository, 'incrementTotalPeople').mockRejectedValue(error);
    const errorSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

    await expect(service.processBatch([{ id: 1, name: 'A', phone: '123', state: 'SP' }])).rejects.toThrow('Repo error');
    expect(errorSpy).toHaveBeenCalledWith('Erro inesperado ao processar batch', error);

    errorSpy.mockRestore();
  });
});
