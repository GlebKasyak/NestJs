import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdeaService } from "./idea.service";
import { IdeaEntity } from "./idea.entity";
import { UserEntity } from "../user/user.entity";
import { IdeaResolver } from "./idea.resolver";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  providers: [IdeaService, IdeaResolver, CommentService]
})
export class IdeaModule {}
