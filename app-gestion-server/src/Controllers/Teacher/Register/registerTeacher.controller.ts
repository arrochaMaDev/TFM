import { Controller, Post, Body } from '@nestjs/common';
import { RegisterTeacherDto } from './registerTeacher.dto';
import { RegisterTeacherService } from './registerteacher.service';

@Controller('teacher')
export class RegisterTeacherController {
  constructor(
    private readonly registerTeacherService: RegisterTeacherService,
  ) {}

  @Post()
  async registerStudent(@Body() data: RegisterTeacherDto) {
    try {
      // const { nombre, apellidos, email, asignaturas, userId } = data;
      const teacherData = await this.registerTeacherService.createTeacher(data);

      const teacher = {
        id: teacherData.id,
        nombre: teacherData.nombre,
        apellidos: teacherData.apellidos,
        email: teacherData.email,
        asignaturas: teacherData.asignaturas,
        usuario: {
          id: teacherData.userId.id,
          username: teacherData.userId.username,
          email: teacherData.userId.email,
          permiso: teacherData.userId.permiso,
        },
      };
      return teacher;
    } catch (error) {
      console.error('Error al crear el profesor:', error);
      throw new Error('No se pudo crear el profesor');
    }
  }
}
