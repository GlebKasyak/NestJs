import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';

import { UserDTO, RequestUserType } from "./user.dto";
import { ValidationPipe } from "../shared/validation.pipe";
import { AuthGuard } from "../shared/auth.guard";
import { UserService } from './user.service';
import { User } from './user.decorator';

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("all")
  @UseGuards(new AuthGuard())
  showAllUsers(
    @User("id") user: RequestUserType,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    return this.userService.showAll(page, limit)
  };

  @Post("login")
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data)
  };

  @Post("register")
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data)
  };
}
