import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDTO): Promise<User> {
    const { fullName, email, password } = dto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      fullName,
      password: hashedPassword,
      email,
    });
    const newUser = this.userRepository.save(user);
    delete (await newUser).password;
    return newUser;
  }

  async findOne(
    email: string,
    selectSecrets: boolean = false,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: selectSecrets,
      },
    });
  }
}
