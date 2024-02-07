import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filter/http.exception.filter';
import { ConfigService } from '@nestjs/config';
import { envConst } from './env.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // error msg format and nested DTO errors hanaled.
      exceptionFactory: (errors) => {
        let errMsg;
        errors.forEach((err) => {
          if (err.children && err.children.length > 0) {
            let childError: any = err.children[0];
            childError =
              childError.children && childError.children.length > 0
                ? childError.children[0].constrains
                : 'Validation error';
            errMsg = Object.values(childError).join('. ').trim();
          } else {
            errMsg = Object.values(err.constraints).join('. ').trim();
          }
        });
        throw new BadRequestException(errMsg);
      },
    }),
  );
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(configService.get(envConst.APP_PORT), () =>
    Logger.log(
      `Application is running on ${configService.get(envConst.APP_PORT)} port.`,
    ),
  );
}
bootstrap();
