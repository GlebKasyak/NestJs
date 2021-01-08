import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { verify } from "jsonwebtoken";
import { GqlExecutionContext } from "@nestjs/graphql";

import Config from "../config";
import { RequestUserType } from "../user/user.dto";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  private async validateToken(header: string) {
    const isBearerHeader = header.split(" ")[0] === "Bearer";
    if (!isBearerHeader) {
      throw new HttpException("Invalid Authorization token", HttpStatus.UNAUTHORIZED);
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new HttpException("Empty Authorization token", HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = (await verify(token, Config.SECRET_KEY)) as RequestUserType;
      const user = await await this.userRepository.findOne({ id: decoded.id });
      if (!user) {
        throw new Error("There is no such users");
      }

      return user;
    } catch (err) {
      throw new HttpException(`Token error: ${err.message}`, HttpStatus.UNAUTHORIZED);
    }
  }

  async canActivate(context: ExecutionContext) {
    // for rest
    let request = context.switchToHttp().getRequest<Request>();
    let header;
    if (request) {
      header = request.headers.authorization;
    } else {
      // for graphql
      request = GqlExecutionContext.create(context).getContext();
      header = request.headers.authorization;
    }

    if (!header) {
      throw new HttpException("Empty Authorization header", HttpStatus.UNAUTHORIZED);
    }

    request.user = await this.validateToken(header);
    return true;
  }
}
