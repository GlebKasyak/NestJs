import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request } from "express";
import { verify } from "jsonwebtoken";

import Config from "../config";
import { RequestUserType } from "../user/user.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const header = request.headers.authorization;
    if (!header) {
      throw new HttpException("Empty Authorization header", HttpStatus.FORBIDDEN);
    }

    const isBearerHeader = header.split(" ")[0] === "Bearer";
    if (!isBearerHeader) {
      throw new HttpException("Invalid Authorization token", HttpStatus.FORBIDDEN);
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new HttpException("Empty Authorization token", HttpStatus.FORBIDDEN);
    }

    try {
      request.user = (await verify(token, Config.SECRET_KEY)) as RequestUserType;

      return true;
    } catch (err) {
      throw new HttpException(`Token error: ${err.message}`, HttpStatus.FORBIDDEN);
    }
  }
}
