import { Body, Controller, Post } from '@nestjs/common';
import { RegisterMatriculaDto } from './RegisterMatricula.dto';
import { RegisterMatriculaService } from './registerMatricula.service';

@Controller('matricula')
export class RegisterMatriculaController {
  constructor(
    private readonly registerMatriculaService: RegisterMatriculaService,
  ) {}

  @Post()
  async registerMatriculaController(@Body() data: RegisterMatriculaDto) {
    try {
      // const { alumno, asignatura, profesor, nota } = data;
      const matriculaData = await this.registerMatriculaService.createMatricula(
        data,
        // alumno,
        // asignatura,
        // profesor,
        // nota,
      );

      const matricula = {
        alumno: {
          nombre: matriculaData.student.nombre,
          apellidos: matriculaData.student.apellidos,
        },
        asignatura: matriculaData.subject.nombre,
        profesor: {
          nombre: matriculaData.teacher.nombre,
          apellidos: matriculaData.teacher.apellidos,
        },
        // nota: matriculaData.nota,
        // EL CAMPO NOTA SE RESERVA PARA LA EVALUACION
      };
      return matricula;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}
