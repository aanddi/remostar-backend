import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://remostar.vercel.app',
      'https://aanddi-remostar-frontend-13b3.twc1.net',
    ],
  });

  await app.listen(5000);
}
bootstrap();
