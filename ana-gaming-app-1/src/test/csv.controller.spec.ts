import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CsvReaderService } from '../csv/csv-reader.service';
import { CsvController } from '../csv/csv.controller';

describe('CsvController', () => {
  let controller: CsvController;
  let service: CsvReaderService;

  beforeEach(async () => {
    const serviceMock = {
      processCsvAndSendBatches: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvController],
      providers: [{ provide: CsvReaderService, useValue: serviceMock }],
    }).compile();

    controller = module.get<CsvController>(CsvController);
    service = module.get<CsvReaderService>(CsvReaderService);
  });

  it('should throw BadRequestException if no file provided', async () => {
    await expect(controller.uploadCsv(null as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should call service and return success message', async () => {
    const fakeFile = {
      path: '/fake/path/file.csv',
      filename: 'file.csv',
    } as Express.Multer.File;

    (service.processCsvAndSendBatches as jest.Mock).mockResolvedValue(
      undefined,
    );

    const response = await controller.uploadCsv(fakeFile);

    expect(service.processCsvAndSendBatches).toHaveBeenCalledWith(
      fakeFile.path,
    );

    expect(response).toEqual({ message: 'CSV processed successfully' });
  });

  it('should throw error if service fails', async () => {
    const fakeFile = {
      path: '/fake/path/file.csv',
      filename: 'file.csv',
    } as Express.Multer.File;

    (service.processCsvAndSendBatches as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );

    await expect(controller.uploadCsv(fakeFile)).rejects.toThrow('fail');
  });
});
