import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user;

  return data ? user && user[data] : user;
});

export default User;
