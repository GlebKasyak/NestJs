import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async showAll(page = 1, limit = 5) {
    const users = await this.userRepository.find({
      relations: ["ideas", "bookmarks"],
      skip: limit * (page - 1),
      take: page
    });
    return users.map(user => user.toResponseObject(false));
  }

  async login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException("Invalid username/password", HttpStatus.BAD_REQUEST);
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    let user = await this.userRepository.findOne({ where: { username: data.username } });
    if (user) {
      throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);

    return user.toResponseObject();
  }
}
