import { IsString, IsNotEmpty, IsObject, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CommentDTO } from "../comment/comment.dto";
import { AuthorDTO } from "../user/user.dto";
import { IdeaDto } from "../shared/common.dto";

export class CreateIdeaDTO {
  @IsNotEmpty()
  @IsString()
  idea: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class FullIdeaDTO extends IdeaDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AuthorDTO)
  author: AuthorDTO;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDTO)
  comments: Array<CommentDTO>;

  @IsNotEmpty()
  upvotes: number | Array<AuthorDTO>;

  @IsNotEmpty()
  downvotes: number | Array<AuthorDTO>;
}
