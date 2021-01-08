import { IsString, IsNotEmpty, IsDate } from "class-validator";

export class IdeaDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  idea: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  readonly created: Date;
}
