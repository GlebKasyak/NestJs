import { IsString, IsNotEmpty, IsDate } from "class-validator";

export class CreateCommentDTO {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsString()
  ideaId: string;
}

export class CommentDTO {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsDate()
  readonly created: Date;
}
