import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import Config from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle(Config.APP_NAME)
    .setDescription(`The ${Config.APP_NAME} API description`)
    .setVersion(Config.APP_VERSION)
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  Logger.log(`Server running on port: ${Config.PORT}`, "Bootstrap");
  await app.listen(Config.PORT);
}
bootstrap();
