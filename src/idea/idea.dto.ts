import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";

import { CommentDTO } from "../comment/comment.dto";
import { AuthorDTO } from "../user/user.dto";
import { IdeaDto } from "../shared/common.dto";

export class CreateIdeaDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  idea: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}

export class FullIdeaDTO extends IdeaDto {
  @ApiProperty()
  author: AuthorDTO;

  @ApiProperty({ type: [CommentDTO] })
  comments: Array<CommentDTO>;

  @ApiProperty({
    oneOf: [{ type: "number" }, { type: "array", items: { $ref: getSchemaPath(AuthorDTO) } }]
  })
  upvotes: number | Array<AuthorDTO>;

  @ApiProperty({
    oneOf: [{ type: "number" }, { type: "array", items: { $ref: getSchemaPath(AuthorDTO) } }]
  })
  downvotes: number | Array<AuthorDTO>;
}
