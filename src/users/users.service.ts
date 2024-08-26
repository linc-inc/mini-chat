import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('ProductsService');
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const {password, ...userData} = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;

    } catch (e) {
      this.handleDBExceptions(e);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['email', 'password']  
    });

    if( !user ) throw new BadRequestException('Credentials are not valid (email)');
    if( !bcrypt.compareSync(password, user.password) ) throw new BadRequestException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({email: user.email})
    };
  }

  getUsers(){
    return this.userRepository.find();
  }

  private getJwtToken( payload: JwtPayload ) {
    return this.jwtService.sign(payload);
  }

  private handleDBExceptions(error: any) {
    console.log(error);
    if( error.code === 'SQLITE_CONSTRAINT' )
      throw new BadRequestException("Entries duplicated.");

    this.logger.error(error.detail);
    throw new InternalServerErrorException('Please check server logs.');
  }
}
