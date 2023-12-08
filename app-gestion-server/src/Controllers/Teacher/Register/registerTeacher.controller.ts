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
    const { nombre, apellidos, email, asignaturas } = data;
    await this.registerTeacherService.createTeacher(
      nombre,
      apellidos,
      email,
      asignaturas,
    );
  }
}
