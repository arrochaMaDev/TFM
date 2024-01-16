import { Body, Controller, Post } from '@nestjs/common';
import { RegisterStudentService } from './registerStudent.service';
import { RegisterStudentDto } from './registerStudent.dto';

@Controller('student')
export class RegisterStudentController {
  constructor(
    private readonly registerStudentService: RegisterStudentService,
  ) {}

  @Post()
  async registerStudent(@Body() data: RegisterStudentDto) {
    try {
      // const { nombre, apellidos, dni, direccion, telefono, email } = data;
      const studentData = await this.registerStudentService.createStudent(data);

      const student = {
        id: studentData.id,
        nombre: studentData.nombre,
        apellidos: studentData.apellidos,
        dni: studentData.dni,
        direccion: studentData.direccion,
        telefono: studentData.telefono,
        email: studentData.email,
        usuario: {
          id: studentData.userId.id,
          username: studentData.userId.username,
          email: studentData.userId.email,
          permiso: studentData.userId.permiso,
        },
      };
      return student;
    } catch (error) {
      console.error('Error al crear el alumno:', error);
      throw new Error('No se pudo crear el alumno');
    }
  }
}
