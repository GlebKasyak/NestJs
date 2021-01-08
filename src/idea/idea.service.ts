import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { IdeaEntity } from "./idea.entity";
import { UserEntity } from "../user/user.entity";
import { CreateIdeaDTO } from "./idea.dto";
import { VOTES } from "../interfaces/enums";

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity) private readonly ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  private async getIdea(id: string) {
    const idea = await this.ideaRepository
      .createQueryBuilder("idea")
      .where("idea.id = :id", { id })
      .leftJoinAndSelect("idea.author", "author")
      .leftJoinAndSelect("idea.upvotes", "upvotes")
      .leftJoinAndSelect("idea.downvotes", "downvotes")
      .leftJoinAndSelect("idea.comments", "comments")
      .getOne();

    if (!idea) {
      throw new HttpException("Idea not found", HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  private ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException("Incorrect user", HttpStatus.UNAUTHORIZED);
    }
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: VOTES) {
    const opposite = vote === VOTES.UP ? VOTES.DOWN : VOTES.UP;

    if (
      idea[opposite].some(voter => voter.id === user.id) ||
      idea[vote].some(voter => voter.id === user.id)
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[opposite].filter(voter => voter.id !== user.id);

      await this.ideaRepository.save(idea);
    } else if (!idea[vote].some(voter => voter.id === user.id)) {
      idea[vote].push(user);

      await this.ideaRepository.save(idea);
    } else {
      throw new HttpException("Unable to cast vote", HttpStatus.BAD_REQUEST);
    }

    return idea;
  }

  async showAll(page: number, limit: number, newest?: boolean) {
    const ideas = await this.ideaRepository
      .createQueryBuilder("idea")
      .leftJoinAndSelect("idea.author", "author")
      .loadRelationCountAndMap("idea.upvotes", "idea.upvotes")
      .loadRelationCountAndMap("idea.downvotes", "idea.downvotes")
      .leftJoinAndSelect("idea.comments", "comments")
      .take(limit)
      .skip(limit * (page - 1))
      .orderBy(newest && { "idea.created": "DESC" })
      .getMany();

    if (ideas && !ideas.length) {
      throw new HttpException("Can't create idea", HttpStatus.BAD_REQUEST);
    }

    return ideas;
  }

  async create(data: CreateIdeaDTO, author: UserEntity) {
    const idea = await this.ideaRepository.create({ ...data, author });
    if (!idea) {
      throw new HttpException("Can't create idea", HttpStatus.BAD_REQUEST);
    }

    await this.ideaRepository.save(idea);
    return { ...idea, author: idea.author.toResponseObject(false) };
  }

  async read(id: string) {
    return await this.getIdea(id);
  }

  async update(id: string, data: Partial<CreateIdeaDTO>, userId: string) {
    const idea = await this.getIdea(id);

    this.ensureOwnership(idea, userId);
    return await this.ideaRepository.save({ ...idea, ...data });
  }

  async destroy(id: string, userId: string) {
    const idea = await this.getIdea(id);

    this.ensureOwnership(idea, userId);
    await this.ideaRepository.delete({ id });
    return idea;
  }

  async bookmark(ideaId: string, userId: string) {
    const idea = await this.getIdea(ideaId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        "bookmarks",
        "bookmarks.author",
        "bookmarks.upvotes",
        "bookmarks.downvotes",
        "bookmarks.comments"
      ]
    });

    if (!user.bookmarks.find(bookmark => bookmark.id === idea.id)) {
      user.bookmarks.push(idea);
      await this.userRepository.save(user);
    } else {
      throw new HttpException("Idea already bookmarked", HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(false);
  }

  async unbookmark(ideaId: string, userId: string) {
    const idea = await this.getIdea(ideaId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["bookmarks"]
    });

    if (user.bookmarks.some(bookmark => bookmark.id === idea.id)) {
      user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);

      await this.userRepository.save(user);
    } else {
      throw new HttpException("This bookmarked not exists", HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject(false);
  }

  async upvote(ideaId: string, user: UserEntity) {
    const idea = await this.getIdea(ideaId);

    return await this.vote(idea, user, VOTES.UP);
  }

  async downvote(ideaId: string, user: UserEntity) {
    const idea = await this.getIdea(ideaId);

    return await this.vote(idea, user, VOTES.DOWN);
  }
}
