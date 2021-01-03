import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { CreateIdeaDTO } from "../idea/idea.dto";
import { IdeaDto } from "../shared/common.dto";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class UserDTO {
  @ApiProperty({ description: "uuid" })
  readonly id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  readonly created: Date;

  @ApiPropertyOptional()
  token?: string;

  @ApiPropertyOptional({ type: [IdeaDto] })
  ideas?: Array<IdeaDto>;

  @ApiPropertyOptional({ type: [IdeaDto] })
  bookmarks?: Array<IdeaDto>;
}

export class AuthorDTO {
  @ApiProperty({ description: "uuid" })
  readonly id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  readonly created: Date;

  @ApiProperty()
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
