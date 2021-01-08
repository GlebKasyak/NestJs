import { Args, Query, Resolver, Mutation, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { CommentService } from "./comment.service";
import { AuthGuard } from "../shared/auth.guard";
import { UserEntity } from "../user/user.entity";

@Resolver("Comment")
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  @UseGuards(AuthGuard)
  comment(@Args("id") id: string) {
    return this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  createComment(
    @Context("user") user: UserEntity,
    @Args("ideaId") ideaId: string,
    @Args("comment") comment: string
  ) {
    return this.commentService.create(user, { comment, ideaId });
  }

  @Mutation()
  @UseGuards(AuthGuard)
  deleteComment(@Context("user") user: UserEntity, @Args("id") id: string) {
    return this.commentService.destroy(id, user.id);
  }
}
