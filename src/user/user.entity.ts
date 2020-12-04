import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import Config from "../config";
import { ResponseObjectType } from "./user.dto";
import { IdeaEntity } from "../idea/idea.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid") readonly id: string

  @CreateDateColumn() readonly created: Date

  @UpdateDateColumn() readonly updated: Date

  @Column({ type: "text", unique: true })
  username: string

  @Column({ type: "text", select: false })
  password: string

  @OneToMany(
    () => IdeaEntity,
    idea => idea.author,
  )
  ideas: Array<IdeaEntity>

  @ManyToMany(() => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: Array<IdeaEntity>

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await compare(attempt, this.password);
  }

  toResponseObject(showToken = true) {
    const { id, created, username, token, ideas, bookmarks } = this;
    const responseObject: ResponseObjectType = { id, created, username, ideas, bookmarks };

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token() {
    return sign({ id: this.id }, Config.SECRET_KEY, { expiresIn: "7d" });
  }
}
