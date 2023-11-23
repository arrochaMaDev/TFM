import { Controller, Get, Param, Res } from '@nestjs/common';
import { GetTeacherService } from './getTeacher.service';
import { Response } from 'express';

@Controller('teacher')
export class GetTeacherController {
  constructor(private readonly getTeacherService: GetTeacherService) {}

  @Get(':id')
  async getTeacher(@Param('id') id: number, @Res() response: Response) {
    const teacher = await this.getTeacherService.getTeacher(Number(id));

    const teacherDto = {
      id: teacher.id,
      usuario_id: teacher.usuario_id,
      nombre: teacher.nombre,
      apellidos: teacher.apellidos,
      email: teacher.email,
    };
    response.send(teacherDto).status(200);
  }
}
