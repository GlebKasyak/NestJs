import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { GqlExecutionContext } from "@nestjs/graphql";

import { GraphQlGetInfo } from "../interfaces/common";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();
    if (request) {
      return next
        .handle()
        .pipe(
          tap(() =>
            Logger.log(
              `method: ${request.method}, url: ${request.url} - After: ${Date.now() - now}ms`,
              context.getClass().name
            )
          )
        );
    }
    const ctx: any = GqlExecutionContext.create(context);
    const info: GraphQlGetInfo = ctx.getInfo();

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `type: ${info.parentType}, scheme: ${info.fieldName} - After: ${Date.now() - now}ms`,
            ctx.constructorRef.name
          )
        )
      );
  }
}
