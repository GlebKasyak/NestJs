import { Catch, HttpException, ArgumentsHost, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpErrorFilter extends HttpException {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    };

    Logger.error(
      `method: ${request.method}, path: ${request.url}`,
      JSON.stringify(responseError),
      "ExceptionFilter",
    );

    response.status(status).json(responseError);
  }
}
