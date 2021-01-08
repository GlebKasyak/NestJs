import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CommentEntity } from "./comment.entity";
import { IdeaEntity } from "../idea/idea.entity";
import { UserEntity } from "../user/user.entity";
import { CreateCommentDTO } from "./comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity) private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async showByIdea(ideaId: string, page: number, limit: number) {
    return await this.commentRepository.find({
      where: { idea: ideaId },
      relations: ["author"],
      take: limit,
      skip: limit * (page - 1)
    });
  }

  async showByUser(userId: string, page: number, limit: number) {
    return await this.commentRepository.find({
      where: { author: userId },
      relations: ["author"],
      take: limit,
      skip: limit * (page - 1)
    });
  }

  async show(commentId: string) {
    const comment = await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.id = :id", { id: commentId })
      .leftJoinAndSelect("comment.author", "author")
      .leftJoinAndSelect("comment.idea", "idea")
      .getOne();

    if (!comment) {
      throw new HttpException("Comment not found", HttpStatus.BAD_REQUEST);
    }
    return comment;
  }

  async create(author: UserEntity, { ideaId, comment }: CreateCommentDTO) {
    const idea = await this.ideaRepository.findOne({ id: ideaId });
    if (!idea) {
      throw new HttpException("This idea doesn't exist", HttpStatus.BAD_REQUEST);
    }
    const createdComment = await this.commentRepository.create({ comment, idea, author });
    if (!createdComment) {
      throw new HttpException("Can't create comment", HttpStatus.BAD_REQUEST);
    }

    return await this.commentRepository.save(createdComment);
  }

  async destroy(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne(
      { id: commentId },
      { relations: ["author", "idea"] }
    );

    if (!comment) {
      throw new HttpException("Comment not found", HttpStatus.BAD_REQUEST);
    }

    if (comment.author.id !== userId) {
      throw new HttpException("You do not own this comment", HttpStatus.UNAUTHORIZED);
    }

    await this.commentRepository.remove(comment);

    comment.id = commentId;
    return comment;
  }
}
