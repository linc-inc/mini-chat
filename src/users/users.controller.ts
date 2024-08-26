import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto){
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.usersService.loginUser(loginUserDto);
  }

  @Get('get-users')
  @UseGuards(AuthGuard())
  getUsers(){
    return this.usersService.getUsers();  
  }
}
