import { Body, Controller, Post } from '@nestjs/common';
import { RegisterMatriculaDto } from './RegisterMatricula.dto';
import { RegisterMatriculaService } from './registerMatricula.service';

@Controller('matricula')
export class RegisterMatriculaController {
  constructor(
    private readonly registerMatriculaService: RegisterMatriculaService,
  ) {}

  @Post()
  async registerMatriculaController(@Body() data1: RegisterMatriculaDto) {
    try {
      // const { alumno, asignatura, profesor, year } = data;
      const matriculaData =
        await this.registerMatriculaService.createMatricula(data1);

      //OBTENER AÑO ESCOLAR AUTOMÁTICAMENTE
      const fullDate = new Date();
      let añoEscolar = new Date().getFullYear(); //2024
      if (fullDate.getMonth() < 7) {
        añoEscolar -= 1;
        // si estamos en julio es que ya habrá acabado el curso escolar anterior
      }
      console.log(añoEscolar);

      const matriculaBD = {
        alumno: {
          nombre: matriculaData.student.nombre,
          apellidos: matriculaData.student.apellidos,
        },
        asignatura: matriculaData.subject.nombre,
        profesor: {
          nombre: matriculaData.teacher.nombre,
          apellidos: matriculaData.teacher.apellidos,
        },
        year: añoEscolar,
      };
      return matriculaBD;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}
