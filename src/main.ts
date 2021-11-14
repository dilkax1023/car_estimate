import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['mycookiesessionkeys'],
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // whitlelist: true => prevent to receive any extra property besides the ones that defined in dto
  await app.listen(3000);
}
bootstrap();
