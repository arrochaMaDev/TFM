import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './registerUser.dto';
import { RegisterUserService } from './registerUser.service';

@Controller('user')
export class RegisterUserController {
  constructor(private readonly registerUserService: RegisterUserService) {}

  @Post()
  async registerUser(@Body() data: RegisterUserDto) {
    const { username, email, pass, permiso } = data;
    await this.registerUserService.createUser(username, email, pass, permiso);
  }
}
