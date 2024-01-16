import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { GetStudentService } from './getStudent.service';
import { Response } from 'express';

@Controller('student')
export class GetStudentController {
  constructor(private readonly getStudentService: GetStudentService) {}

  @Get(':id')
  async getStudent(@Param('id') id: number, @Res() response: Response) {
    try {
      const student = await this.getStudentService.getStudent(Number(id));

      // const studentDto = {
      //   id: student.id,
      //   usuario_id: student.usuario_id,
      //   nombre: student.nombre,
      //   apellidos: student.apellidos,
      //   dni: student.dni,
      //   direccion: student.direccion,
      //   telefono: student.telefono,
      //   email: student.email,
      // };
      return response.status(HttpStatus.OK).json(student);
    } catch (error) {
      console.error(error);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
