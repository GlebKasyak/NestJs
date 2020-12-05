import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CommentEntity } from "../comment/comment.entity";

@Entity("idea")
export class IdeaEntity {
  @PrimaryGeneratedColumn("uuid") readonly id: string;

  @CreateDateColumn() readonly created: Date;

  @Column("text") idea: string;

  @Column("text") description: string;

  @ManyToOne(
    () => UserEntity,
    author => author.ideas,
  )
  author: UserEntity;

  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: Array<UserEntity>;

  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: Array<UserEntity>;

  @OneToMany(
    () => CommentEntity,
    comment => comment.idea,
    { cascade: true },
  )
  comments: Array<CommentEntity>;
}
