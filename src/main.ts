import "dotenv/config";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  let swaggerConfig = new DocumentBuilder().setTitle("Black_Hole").setVersion("1.0.0").addBearerAuth().build();

  let doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, doc);
  const port: number = Number(process.env.PORT ?? 5678);
  await app.listen(port);

  console.log(`Server is listening on: ${port}`);
  console.log(`-----------------------------------`);
  console.log(`You can check on here: http://localhost:${port}/docs`);
}
bootstrap();
