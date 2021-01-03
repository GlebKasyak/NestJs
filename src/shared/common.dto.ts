import { ApiProperty } from "@nestjs/swagger";

export class IdeaDto {
  @ApiProperty({ description: "uuid" })
  readonly id: string;

  @ApiProperty()
  idea: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  readonly created: Date;
}
