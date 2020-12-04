import { IsString } from 'class-validator';

export class CommentDTO {

  @IsString()
  comment: string;
};

export type CommentType = {
  comment: string,
  ideaId: string
};
