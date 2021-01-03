import {
  Body,
  Request,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  DefaultValuePipe,
  HttpStatus
} from "@nestjs/common";
import { Request as IRequest } from "express";
import { ApiTags } from "@nestjs/swagger";

import { CommentService } from "./comment.service";
import User from "../user/user.decorator";
import {
  RequiredPaginationQueries,
  Auth,
  CommonResponseSwaggerDecorator
} from "../shared/common.decorators";
import { ValidationPipe } from "../shared/validation.pipe";
import { CreateCommentDTO, FullCommentDTO, CommentDTOWIthAuthor } from "./comment.dto";

@ApiTags("comment")
@Controller("api/comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("idea/:id")
  @Auth()
  @RequiredPaginationQueries()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current comments",
    dtoType: CommentDTOWIthAuthor,
    resIsArray: true,
    errorMessage: "This idea hasn't any comments"
  })
  showCommentsByIdea(
    @Param("id") ideaId: string,
    @Query("page", new DefaultValuePipe(1)) page: number,
    @Query("limit", new DefaultValuePipe(5)) limit: number
  ) {
    return this.commentService.showByIdea(ideaId, page, limit);
  }

  @Get("user/:id")
  @Auth()
  @RequiredPaginationQueries()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current comments",
    dtoType: CommentDTOWIthAuthor,
    resIsArray: true,
    errorMessage: "This idea hasn't any comments"
  })
  showCommentsByUser(
    @Param("id") userId: string,
    @Query("page") page: number,
    @Query("limit") limit: number
  ) {
    return this.commentService.showByUser(userId, page, limit);
  }

  @Post()
  @Auth()
  @UsePipes(new ValidationPipe())
  @CommonResponseSwaggerDecorator({
    resMessage: "Created comment",
    resStatus: HttpStatus.CREATED,
    dtoType: FullCommentDTO,
    errorMessage: "Can't create idea"
  })
  createComment(@Request() req: IRequest, @Body() data: CreateCommentDTO) {
    return this.commentService.create(req.user, data);
  }

  @Get(":id")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current comment",
    dtoType: FullCommentDTO,
    errorMessage: "Comment not found"
  })
  showComment(@Param("id") commentId: string) {
    return this.commentService.show(commentId);
  }

  @Delete(":id")
  @Auth()
  @CommonResponseSwaggerDecorator({
    resMessage: "Current comment",
    dtoType: FullCommentDTO,
    errorMessage: "Comment not found",
    resErrStatus: HttpStatus.UNAUTHORIZED,
    secondErrMessage: "You do not own this comment"
  })
  destroyComment(@User("id") userId: string, @Param("id") commentId: string) {
    return this.commentService.destroy(commentId, userId);
  }
}
