import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IdeaModule } from "./idea/idea.module";
import { UserModule } from "./user/user.module";

import { HttpErrorFilter } from "./shared/error.filter";
import { LoggingInterceptor } from "./shared/logging.interceptor";
import { CommentModule } from "./comment/comment.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql"]
    }),
    TypeOrmModule.forRoot(),
    IdeaModule,
    UserModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
