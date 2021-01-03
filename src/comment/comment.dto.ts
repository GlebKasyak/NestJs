import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { AuthorDTO } from "../user/user.dto";
import { IdeaDto } from "../shared/common.dto";

export class CreateCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({ description: "uuid" })
  @IsNotEmpty()
  @IsString()
  ideaId: string;
}

export class CommentDTO {
  @ApiProperty({ description: "uuid" })
  readonly id: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  readonly created: Date;
}

export class FullCommentDTO {
  @ApiProperty({ description: "uuid" })
  readonly id: string;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  author: AuthorDTO;

  @ApiProperty()
  idea: IdeaDto;

  @ApiProperty()
  readonly created: Date;
}

export class CommentDTOWIthAuthor extends CommentDTO {
  @ApiProperty()
  author: AuthorDTO;
}
