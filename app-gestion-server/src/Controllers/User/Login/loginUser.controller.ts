import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginUserService } from './loginUser.service';
import { LoginUserDto } from './loginUser.dto';
import { Response } from 'express';

@Controller('login')
export class LoginUserController {
  constructor(private readonly loginUserService: LoginUserService) {}

  @Post()
  async loginUser(@Res() response: Response, @Body() data: LoginUserDto) {
    const { email, username, pass } = data;

    const { isValid, permiso, id } = await this.loginUserService.login(
      email,
      username,
      pass,
    );

    if (!isValid) {
      response.sendStatus(HttpStatus.FORBIDDEN);
      console.log('Usuario o contraseña incorrectos');
    } else {
      const userObject = {
        // email: email,
        username,
        isValid: true,
        permiso,
        id,
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
