import { Body, Controller, Post } from '@nestjs/common';
import { RegisterMatriculaService } from './RegisterMatricula.service';
import { RegisterMatriculaDto } from './RegisterMatricula.dto';

@Controller('matricula')
export class RegisterMatriculaController {
  constructor(
    private readonly registerMatriculaService: RegisterMatriculaService,
  ) {}

  @Post()
  async registerMatriculaController(@Body() data: RegisterMatriculaDto) {
    try {
      const { alumno, asignatura, profesor, nota } = data;
      const savedMatricula =
        await this.registerMatriculaService.createMatricula(
          data,
          // alumno,
          // asignatura,
          // profesor,
          // nota,
        );
      return savedMatricula;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}
