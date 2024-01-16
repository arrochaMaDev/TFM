import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginUserService } from './loginUser.service';
import { LoginUserDto } from './loginUser.dto';
import { Response } from 'express';

@Controller('login')
export class LoginUserController {
  constructor(private readonly loginUserService: LoginUserService) {}

  @Post()
  async loginUser(@Res() response: Response, @Body() data: LoginUserDto) {
    const { email, pass } = data;

    const { isValid, permiso } = await this.loginUserService.login(email, pass);

    if (!isValid) {
      response.sendStatus(HttpStatus.FORBIDDEN);
      console.log('Usuario o contraseña incorrectos');
    } else {
      const userObject = {
        email: email,
        isValid: true,
        permiso,
      };
      console.log('logged');
      response
        .cookie('user', JSON.stringify(userObject), {
          domain: 'localhost',
          maxAge: Date.now() / 1000 + 3600,
        })
        .sendStatus(HttpStatus.NO_CONTENT);
      console.log(userObject);
    }
  }
}
