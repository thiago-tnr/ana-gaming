import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3030);
  console.log('Application is running on http://localhost:3030');
}

bootstrap().catch((error) => {
  console.error('Erro no bootstrap:', error);
  process.exit(1);
});
