import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  DefaultValuePipe,
  HttpStatus
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDTO, RequestUserType } from "./user.dto";
import { ValidationPipe } from "../shared/validation.pipe";
import { UserService } from "./user.service";
import User from "./user.decorator";
import {
  RequiredPaginationQueries,
  Auth,
  CommonResponseSwaggerDecorator
} from "../shared/common.decorators";
import { UserDTO } from "./user.dto";

@ApiTags("user")
@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("all")
  @Auth()
  @RequiredPaginationQueries()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current users",
    dtoType: UserDTO,
    resIsArray: true,
    errorMessage: "Users not found"
  })
  showAllUsers(
    @User("id") user: RequestUserType,
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(5)) limit: number
  ) {
    return this.userService.showAll(page, limit);
  }

  @Post("login")
  @UsePipes(new ValidationPipe())
  @CommonResponseSwaggerDecorator({
    resMessage: "You are logged in",
    dtoType: UserDTO,
    errorMessage: "Invalid username/password"
  })
  login(@Body() data: CreateUserDTO) {
    return this.userService.login(data);
  }

  @Post("register")
  @UsePipes(new ValidationPipe())
  @CommonResponseSwaggerDecorator({
    resMessage: "You are logged in",
    resStatus: HttpStatus.CREATED,
    dtoType: UserDTO,
    errorMessage: "Can not create user"
  })
  register(@Body() data: CreateUserDTO) {
    return this.userService.register(data);
  }
}
