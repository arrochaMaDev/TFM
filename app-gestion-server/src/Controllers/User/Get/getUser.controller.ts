import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetUserService } from './getUser.service';

@Controller('usuario')
export class GetUserController {
  constructor(private readonly getUserService: GetUserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number, @Res() response: Response) {
    const user = await this.getUserService.getUser(Number(id));
    // const userDto = {
    //   id: user.id,
    //   username: user.username,
    //   email: user.email,
    //   pass: user.pass,
    //   permiso: user.permiso,
    // };
    response.send(user).status(200);
  }
}
