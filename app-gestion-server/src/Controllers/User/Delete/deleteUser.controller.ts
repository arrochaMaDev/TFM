import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteUserService } from './deleteUser.service';

@Controller('usuario')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteUserService.deleteUser(Number(id));
      response.status(204).send(); // Usuario eliminado con éxito
      console.log('Usuario eliminado');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
