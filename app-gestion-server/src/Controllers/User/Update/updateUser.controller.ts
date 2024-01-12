import { Controller, Put, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserDb } from 'src/Modelos/User/userDb';
import { UpdateUserService } from './updateUser.service';

@Controller('usuario')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updatedData: Partial<UserDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.updateUserService.updateUser(
        Number(id),
        updatedData,
      );
      response.status(HttpStatus.OK).json(updatedUser); // Devuelve el profesor actualizado
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
