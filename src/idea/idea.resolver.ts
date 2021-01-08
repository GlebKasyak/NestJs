import { Args, Context, Mutation, Parent, Query, ResolveProperty, Resolver } from "@nestjs/graphql";
import { Logger, UseGuards } from "@nestjs/common";

import { IdeaService } from "./idea.service";
import { GetPaginationArgs } from "../interfaces/common";
import { FullIdeaDTO, CreateIdeaDTO } from "./idea.dto";
import { CommentService } from "../comment/comment.service";
import { UserEntity } from "../user/user.entity";
import { LogDataOptionsType } from "../user/user.dto";
import { AuthGuard } from "../shared/auth.guard";

@Resolver("Idea")
export class IdeaResolver {
  constructor(private ideaService: IdeaService, private commentService: CommentService) {}
  private logger = new Logger("IdeaController");

  private logData(options: LogDataOptionsType) {
    options.userId && this.logger.log(`USER ${JSON.stringify(options.userId)}`);
    options.data && this.logger.log(`BODY ${JSON.stringify(options.data)}`);
    options.ideaId && this.logger.log(`IDEA ${JSON.stringify(options.ideaId)}`);
  }

  @Query()
  @UseGuards(AuthGuard)
  ideas(@Args() { limit, page, newest }: GetPaginationArgs & { newest?: boolean }) {
    return this.ideaService.showAll(page, limit, newest);
  }

  @ResolveProperty()
  comments(@Parent() idea: FullIdeaDTO, @Args() { limit, page }: GetPaginationArgs) {
    return this.commentService.showByIdea(idea.id, page, limit);
  }

  @Query()
  @UseGuards(AuthGuard)
  idea(@Args("id") ideaId: string) {
    this.logData({ ideaId });
    return this.ideaService.read(ideaId);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  createIdea(@Context("user") user: UserEntity, @Args() data: CreateIdeaDTO) {
    this.logData({ userId: user.id, data });
    return this.ideaService.create(data, user);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  updateIdea(
    @Context("user") user: UserEntity,
    @Args() data: CreateIdeaDTO,
    @Args("ideaId") ideaId: string
  ) {
    this.logData({ userId: user.id, data, ideaId });
    return this.ideaService.update(ideaId, data, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  destroyIdea(@Context("user") user: UserEntity, @Args("ideaId") ideaId: string) {
    this.logData({ userId: user.id, ideaId });
    return this.ideaService.destroy(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  bookmarkIdea(@Context("user") user: UserEntity, @Args("ideaId") ideaId: string) {
    this.logData({ userId: user.id, ideaId });
    return this.ideaService.bookmark(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  unbookmarkIdea(@Context("user") user: UserEntity, @Args("ideaId") ideaId: string) {
    this.logData({ userId: user.id, ideaId });
    return this.ideaService.unbookmark(ideaId, user.id);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  upvoteIdea(@Context("user") user: UserEntity, @Args("ideaId") ideaId: string) {
    this.logData({ userId: user.id, ideaId });
    return this.ideaService.upvote(ideaId, user);
  }

  @Mutation()
  @UseGuards(AuthGuard)
  downvoteIdea(@Context("user") user: UserEntity, @Args("ideaId") ideaId: string) {
    this.logData({ userId: user.id, ideaId });
    return this.ideaService.downvote(ideaId, user);
  }
}
