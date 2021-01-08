import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { UserResolver } from "./user.resolver";
import { IdeaEntity } from "../idea/idea.entity";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdeaEntity, CommentEntity])],
  providers: [UserService, UserResolver, CommentService]
})
export class UserModule {}
