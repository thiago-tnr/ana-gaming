import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StateTotalService } from './application/state-total.service';
import { StateTotalRepository } from './interfaces/mongodb/state-total.repository';
import { StateTotalDocument, StateTotalSchema } from './interfaces/mongodb/state-total.schema';
import { StateTotalConsumer } from './interfaces/controllers/state-total.consumer';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    MongooseModule.forFeature([
      { name: StateTotalDocument.name, schema: StateTotalSchema },
    ]),
  ],
  controllers: [StateTotalConsumer],
  providers: [StateTotalService, StateTotalRepository],
})
export class AppModule {}
