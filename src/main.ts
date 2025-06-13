import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ServiceExceptionFilter } from './common/filter/service.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credential: true });
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ServiceExceptionFilter(app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
