import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards, Logger, Query } from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDTO } from "./idea.dto";
import { ValidationPipe } from "../shared/validation.pipe";
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { LogDataOptionsType } from '../user/user.dto';

@Controller("api/idea")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}
  private logger = new Logger("IdeaController");

  private logData(options: LogDataOptionsType) {
    options.userId && this.logger.log("USER " + JSON.stringify(options.userId))
    options.data && this.logger.log("BODY " + JSON.stringify(options.data))
    options.ideaId && this.logger.log("IDEA " + JSON.stringify(options.ideaId))
  };

  @Get()
  @UseGuards(new AuthGuard())
  showAllIdeas(@Query("page") page: number, @Query("limit") limit: number){
    return this.ideaService.showAll(page, limit);
  };

  @Get("/newest")
  showNewestIdeas(@Query("page") page: number, @Query("limit") limit: number) {
    return this.ideaService.showAll(page, limit, true)
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User("id") userId: string, @Body() data: IdeaDTO){
    this.logData({ userId, data });
    return this.ideaService.create(data, userId);
  };

  @Get(":id")
  @UseGuards(new AuthGuard())
  readIdea(@Param("id") ideaId: string) {
    return this.ideaService.read(ideaId);
  };

  @Put(":id")
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea(
    @User("id") userId: string,
    @Param("id") ideaId: string,
    @Body() data: Partial<IdeaDTO>
  ){
    this.logData({ userId, data, ideaId });
    return this.ideaService.update(ideaId, data, userId);
  };

  @Delete(":id")
  @UseGuards(new AuthGuard())
  destroyIdea(@User("id") userId: string, @Param("id") ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.destroy(ideaId, userId);
  };

  @Get(":id/bookmark")
  @UseGuards(new AuthGuard())
  bookmarkIdea(@User("id") userId: string, @Param("id") ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.bookmark(ideaId, userId);
  };

  @Delete(":id/bookmark")
  @UseGuards(new AuthGuard())
  unbookmarkIdea(@User("id") userId: string, @Param("id") ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.unbookmark(ideaId, userId);
  };

  @Get(":id/upvote")
  @UseGuards(new AuthGuard())
  upvoteIdea(@User("id") userId: string, @Param("id") ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.upvote(ideaId, userId);
  };

  @Delete(":id/downvote")
  @UseGuards(new AuthGuard())
  downvoteIdea(@User("id") userId: string, @Param("id") ideaId: string) {
    this.logData({ userId, ideaId });
    return this.ideaService.downvote(ideaId, userId);
  };
};

