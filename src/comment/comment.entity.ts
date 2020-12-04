import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { IdeaEntity } from '../idea/idea.entity';

@Entity("comment")
export class CommentEntity {
  @PrimaryGeneratedColumn("uuid") readonly id: string;

  @CreateDateColumn() readonly created: Date;

  @Column("text") comment: string;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @ManyToOne(type => IdeaEntity, idea => idea.comments)
  idea: IdeaEntity;
};
