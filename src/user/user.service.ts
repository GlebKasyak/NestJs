import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { CreateUserDTO } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async showAll(limit: number, page: number) {
    const users = await this.userRepository.find({
      relations: ["ideas", "bookmarks"],
      take: limit,
      skip: limit * (page - 1)
    });

    if (users && !users.length) {
      throw new HttpException("Users not found", HttpStatus.BAD_REQUEST);
    }

    return users.map(user => user.toResponseObject(false));
  }

  async getUser(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ["ideas", "bookmarks"]
    });
    if (!user) {
      throw new HttpException("This user does not found", HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject(false);
  }

  async login(data: CreateUserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({
      where: { username },
      select: ["id", "created", "username", "password"]
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException("Invalid username/password", HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject();
  }

  async register(data: CreateUserDTO) {
    const user = await this.userRepository.create(data);
    if (!user) {
      throw new HttpException("Can not create user", HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.save(user);
    return user.toResponseObject();
  }
}
