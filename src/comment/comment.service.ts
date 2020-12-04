import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../idea/idea.entity';
import { UserEntity } from '../user/user.entity';
import { CommentType } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity) private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {};

  async showByIdea(ideaId: string, page = 1, limit = 5) {
    return await this.commentRepository.find({
      where: { idea: ideaId },
      relations: ["author"],
      take: page,
      skip: limit * (page - 1)
    });
  };

  async showByUser(userId: string, page = 1, limit = 5) {
    return await this.commentRepository.find({
      where: { author: userId },
      relations: ["author"],
      take: page,
      skip: limit * (page - 1)
    });
  };

  async show(commentId: string) {
    return await this.commentRepository
      .createQueryBuilder("comment")
      .where("comment.id = :id", { id: commentId })
      .leftJoinAndSelect("comment.author", "author")
      .leftJoinAndSelect("comment.idea", "idea")
      .getOne();
  };

  async create(userId: string, { ideaId, comment } : CommentType) {
    const user = await this.userRepository.findOne({ id: userId });
    const idea = await this.ideaRepository.findOne({ id: ideaId });
    const createdComment = await this.commentRepository.create({ comment, idea, author: user });

    return await this.commentRepository.save(createdComment);
  };

  async destroy(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({ id: commentId }, { relations: ["author", "idea"] });
    if(comment.author.id !== userId) {
      throw new HttpException("You do not own this comment", HttpStatus.UNAUTHORIZED);
    };

    await this.commentRepository.remove(comment);
    return comment;
  };
}
