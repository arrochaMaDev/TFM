import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetSubjectService } from 'src/Controllers/Subject/Get/getSubject.service';
import { GetTeacherByUserIdService } from './getTeacherByUserId.service.ts';

@Controller('teacher')
export class GetTeacherByUserIdController {
  constructor(
    private readonly getTeacherByUserIdService: GetTeacherByUserIdService,
  ) {}

  // OBTENER PROFESOR POR ID DEL USUARIO
  @Get('user/:id')
  async getTeacherByUsuarioId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const userId = Number(id);

      const teacher =
        await this.getTeacherByUserIdService.getTeacherByUserId(userId);

      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'No existe profesor para este usuario' });
      }

      return response.status(200).json(teacher);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
