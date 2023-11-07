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
    const { nombre, apellidos, dni, direccion, telefono, email } = data;
    await this.registerStudentService.createStudent(
      nombre,
      apellidos,
      dni,
      direccion,
      telefono,
      email,
    );
  }
}
