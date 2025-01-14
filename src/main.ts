import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Env } from './env';
import { AppModule } from './infra/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Env, true>);
  const PORT = configService.get('PORT', { infer: true });

  await app.listen(PORT);
}
bootstrap();
