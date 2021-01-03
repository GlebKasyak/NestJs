import {
  Controller,
  Request,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  Logger,
  Query,
  DefaultValuePipe,
  HttpStatus
} from "@nestjs/common";
import { Request as IRequest } from "express";
import { ApiTags } from "@nestjs/swagger";

import { IdeaService } from "./idea.service";
import { CreateIdeaDTO, FullIdeaDTO } from "./idea.dto";
import { LogDataOptionsType, UserDTO } from "../user/user.dto";
import { ValidationPipe } from "../shared/validation.pipe";
import User from "../user/user.decorator";
import {
  RequiredPaginationQueries,
  Auth,
  CommonResponseSwaggerDecorator
} from "../shared/common.decorators";
import { PARAMS } from "../interfaces/enums";

@ApiTags("idea")
@Controller("api/idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}
  private logger = new Logger("IdeaController");

  private logData(options: LogDataOptionsType) {
    options.userId && this.logger.log(`USER ${JSON.stringify(options.userId)}`);
    options.data && this.logger.log(`BODY ${JSON.stringify(options.data)}`);
    options.ideaId && this.logger.log(`IDEA ${JSON.stringify(options.ideaId)}`);
  }

  @Get()
  @Auth()
  @RequiredPaginationQueries()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current ideas",
    dtoType: FullIdeaDTO,
    resIsArray: true
  })
  showAllIdeas(
    @Query(PARAMS.PAGE, new DefaultValuePipe(1)) page: number,
    @Query(PARAMS.LIMIT, new DefaultValuePipe(5)) limit: number
  ) {
    return this.ideaService.showAll(page, limit);
  }

  @Get("/newest")
  @Auth()
  @RequiredPaginationQueries()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current ideas",
    dtoType: FullIdeaDTO,
    resIsArray: true
  })
  showNewestIdeas(
    @Query(PARAMS.PAGE, new DefaultValuePipe(1)) page: number,
    @Query(PARAMS.LIMIT, new DefaultValuePipe(5)) limit: number
  ) {
    return this.ideaService.showAll(page, limit, true);
  }

  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  @CommonResponseSwaggerDecorator({
    resMessage: "Created idea",
    resStatus: HttpStatus.CREATED,
    dtoType: FullIdeaDTO,
    errorMessage: "Can't create idea"
  })
  createIdea(
    @User(PARAMS.ID) userId: string,
    @Body() data: CreateIdeaDTO,
    @Request() req: IRequest
  ) {
    this.logData({ userId, data });
    return this.ideaService.create(data, req.user);
  }

  @Get(":id")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Retrieved idea by ID successfully",
    dtoType: FullIdeaDTO,
    errorMessage: "Idea not found"
  })
  readIdea(@Param(PARAMS.ID) ideaId: string) {
    this.logData({ ideaId });
    return this.ideaService.read(ideaId);
  }

  @Put(":id")
  @Auth()
  @UsePipes(new ValidationPipe())
  @CommonResponseSwaggerDecorator({
    resMessage: "Updated idea by ID successfully",
    dtoType: FullIdeaDTO,
    errorMessage: "Idea not found",
    resErrStatus: HttpStatus.UNAUTHORIZED,
    secondErrMessage: "Incorrect user"
  })
  updateIdea(
    @User(PARAMS.ID) userId: string,
    @Param(PARAMS.ID) ideaId: string,
    @Body() data: CreateIdeaDTO
  ) {
    this.logData({ userId, data, ideaId });
    return this.ideaService.update(ideaId, data, userId);
  }

  @Delete(":id")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Deleted idea by ID successfully",
    dtoType: FullIdeaDTO,
    errorMessage: "Idea not found",
    resErrStatus: HttpStatus.UNAUTHORIZED,
    secondErrMessage: "Incorrect user"
  })
  destroyIdea(@User(PARAMS.ID) userId: string, @Param(PARAMS.ID) ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.destroy(ideaId, userId);
  }

  @Get(":id/bookmark")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Idea by ID was bookmarked",
    dtoType: UserDTO,
    errorMessage: "Idea already bookmarked"
  })
  bookmarkIdea(@User(PARAMS.ID) userId: string, @Param(PARAMS.ID) ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.bookmark(ideaId, userId);
  }

  @Delete(":id/bookmark")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Idea by ID was unbookmarked",
    dtoType: UserDTO,
    errorMessage: "This bookmarked not exists"
  })
  unbookmarkIdea(@User(PARAMS.ID) userId: string, @Param(PARAMS.ID) ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.unbookmark(ideaId, userId);
  }

  @Get(":id/upvote")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Upvote idea by ID successfully",
    dtoType: FullIdeaDTO,
    errorMessage: "Idea not found"
  })
  upvoteIdea(
    @User(PARAMS.ID) userId: string,
    @Param(PARAMS.ID) ideaId: string,
    @Request() req: IRequest
  ) {
    this.logData({ userId, ideaId });
    return this.ideaService.upvote(ideaId, req.user);
  }

  @Delete(":id/downvote")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Downvote idea by ID successfully",
    dtoType: FullIdeaDTO,
    errorMessage: "Idea not found"
  })
  downvoteIdea(
    @User(PARAMS.ID) userId: string,
    @Param(PARAMS.ID) ideaId: string,
    @Request() req: IRequest
  ) {
    this.logData({ userId, ideaId });
    return this.ideaService.downvote(ideaId, req.user);
  }
}
