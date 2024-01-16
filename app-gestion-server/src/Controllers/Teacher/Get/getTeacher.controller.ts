import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { GetTeacherService } from './getTeacher.service';
import { Response } from 'express';

@Controller('teacher')
export class GetTeacherController {
  constructor(private readonly getTeacherService: GetTeacherService) {}

  @Get(':id')
  async getTeacher(@Param('id') id: number, @Res() response: Response) {
    try {
      const teacher = await this.getTeacherService.getTeacher(Number(id));

      // const teacherDto = {
      //   id: teacher.id,
      //   usuario_id: teacher.usuario_id,
      //   nombre: teacher.nombre,
      //   apellidos: teacher.apellidos,
      //   email: teacher.email,
      //   asignaturas: teacher.asignaturas,
      //   usuario: {
      //     id: teacher.userId.id,
      //     username: teacher.userId.username,
      //     email: teacher.userId.email,
      //     permiso: teacher.userId.permiso,
      //   },
      // };
      return response.status(HttpStatus.OK).json(teacher);
    } catch (error) {
      console.error(error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
