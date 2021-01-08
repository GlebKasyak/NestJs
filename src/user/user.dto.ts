import { IsString, IsNotEmpty, IsDate, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateIdeaDTO } from "../idea/idea.dto";
import { IdeaDto } from "../shared/common.dto";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDate()
  @IsNotEmpty()
  readonly created: Date;

  @IsString()
  token?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdeaDto)
  ideas?: Array<IdeaDto>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdeaDto)
  bookmarks?: Array<IdeaDto>;
}

export class AuthorDTO {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsDate()
  @IsNotEmpty()
  readonly created: Date;

  @IsDate()
  @IsNotEmpty()
  readonly updated: Date;
}

export type RequestUserType = {
  readonly id: string;
  readonly iat: number;
  readonly exp: number;
};

export type LogDataOptionsType = {
  userId?: string;
  data?: CreateIdeaDTO | Partial<CreateIdeaDTO>;
  ideaId?: string;
};
