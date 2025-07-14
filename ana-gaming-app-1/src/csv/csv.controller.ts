// src/csv/csv.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvReaderService } from './csv-reader.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('csv')
export class CsvController {
  private readonly logger = new Logger(CsvController.name);

  constructor(private readonly csvReaderService: CsvReaderService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `upload-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.csv$/)) {
          return cb(
            new BadRequestException('Only CSV files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    this.logger.log(`Received file: ${file.filename}`);

    try {
      await this.csvReaderService.processCsvAndSendBatches(file.path);
      this.logger.log('CSV processed successfully');
      return { message: 'CSV processed successfully' };
    } catch (error) {
      this.logger.error('Error processing CSV', error);
      throw error;
    }
  }
}
