import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes
} from "@nestjs/common";

import { CommentService } from "./comment.service";
import { User } from "../user/user.decorator";
import { AuthGuard } from "../shared/auth.guard";
import { ValidationPipe } from "../shared/validation.pipe";
import { CommentType } from "./comment.dto";

@Controller("api/comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("idea/:id")
  @UseGuards(new AuthGuard())
  showCommentsByIdea(
    @Param("id") ideaId: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    return this.commentService.showByIdea(ideaId, page, limit);
  }

  @Get("user/:id")
  @UseGuards(new AuthGuard())
  showCommentsByUser(
    @Param("id") userId: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    return this.commentService.showByUser(userId, page, limit);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createComment(@User("id") userId: string, @Body() data: CommentType) {
    return this.commentService.create(userId, data);
  }

  @Get(":id")
  @UseGuards(new AuthGuard())
  showComment(@Param("id") commentId: string) {
    return this.commentService.show(commentId);
  }

  @Delete(":id")
  @UseGuards(new AuthGuard())
  destroyComment(@User("id") userId: string, @Param("id") commentId: string) {
    return this.commentService.destroy(commentId, userId);
  }
}
