import { IsString, IsNotEmpty } from "class-validator";

import { IdeaDTO } from "../idea/idea.dto";
import { IdeaEntity } from "../idea/idea.entity";

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export type ResponseObjectType = {
  readonly id: string
  readonly created: Date
  username: string
  token?: string
  ideas: Array<IdeaEntity>
  bookmarks: Array<IdeaEntity>
}

export type RequestUserType = {
  readonly id: string
  readonly iat: number
  readonly exp: number
}

export type LogDataOptionsType = {
  userId?: string
  data?: IdeaDTO | Partial<IdeaDTO>
  ideaId?: string
}
