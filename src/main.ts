import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";

import { AppModule } from "./app.module";
import Config from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config.PORT);
  Logger.log(`Server running on port: ${Config.PORT}`, "Bootstrap");
}
bootstrap();
