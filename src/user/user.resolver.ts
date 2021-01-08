import { Args, Query, ResolveProperty, Resolver, Parent, Mutation, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { CreateUserDTO, UserDTO } from "./user.dto";
import { GetPaginationArgs } from "../interfaces/common";
import { CommentService } from "../comment/comment.service";
import { AuthGuard } from "../shared/auth.guard";
import { UserEntity } from "./user.entity";

@Resolver("User")
export class UserResolver {
  constructor(private userService: UserService, private commentService: CommentService) {}

  @Query()
  @UseGuards(AuthGuard)
  users(@Args() { limit, page }: GetPaginationArgs) {
    return this.userService.showAll(limit, page);
  }

  @Query()
  user(@Args("username") username: string) {
    return this.userService.getUser(username);
  }

  @Query()
  @UseGuards(AuthGuard)
  whoami(@Context("user") user: UserEntity) {
    return this.userService.getUser(user.username);
  }

  @Mutation()
  login(@Args() data: CreateUserDTO) {
    return this.userService.login(data);
  }

  @Mutation()
  register(@Args() data: CreateUserDTO) {
    return this.userService.register(data);
  }

  @ResolveProperty()
  comments(@Parent() user: UserDTO, @Args() { limit, page }: GetPaginationArgs) {
    return this.commentService.showByUser(user.id, page, limit);
  }
}
