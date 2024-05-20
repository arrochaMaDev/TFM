import { Body, Controller, Post } from '@nestjs/common';
import { RegisterEvaluacionService } from './RegisterEvaluacion.service';
import { RegisterEvaluacionDto } from './RegisterEvaluacion.dto';

@Controller('evaluacion')
export class RegisterEvaluacionController {
  constructor(
    private readonly registerEvaluacionService: RegisterEvaluacionService,
  ) {}

  @Post()
  async registerEvaluacionController(@Body() data: RegisterEvaluacionDto) {
    try {
      const evaluacionData =
        await this.registerEvaluacionService.createEvaluacion(data);

      const evaluacion = {
        matricula: {
          id: evaluacionData.matricula.id,
          year: evaluacionData.matricula.year,
          student: {
            id: evaluacionData.matricula.student.id,
            nombre: evaluacionData.matricula.student.nombre,
            apellidos: evaluacionData.matricula.student.apellidos,
            dni: evaluacionData.matricula.student.dni,
            telefono: evaluacionData.matricula.student.telefono,
            email: evaluacionData.matricula.student.email,
          },
          subject: {
            id: evaluacionData.matricula.subject.id,
            nombre: evaluacionData.matricula.subject.nombre,
          },
          teacher: {
            id: evaluacionData.matricula.teacher.id,
            nombre: evaluacionData.matricula.teacher.nombre,
            apellidos: evaluacionData.matricula.teacher.apellidos,
            dni: evaluacionData.matricula.teacher.dni,
            telefono: evaluacionData.matricula.teacher.telefono,
            email: evaluacionData.matricula.teacher.email,
          },
        },
        nota1: evaluacionData.nota1,
        comentario1: evaluacionData.comentario1,
        nota2: evaluacionData.nota2,
        comentario2: evaluacionData.comentario2,
        nota3: evaluacionData.nota3,
        comentario3: evaluacionData.comentario3,
      };

      return evaluacion;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}
