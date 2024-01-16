import { Controller, Get } from '@nestjs/common';
import { ListerMatriculasService } from './listerMatriculas.service';

@Controller('matriculas')
export class ListerMatriculasController {
  constructor(
    private readonly listerMatriculasService: ListerMatriculasService,
  ) {}

  @Get()
  async ListerMatriculas() {
    return this.listerMatriculasService.listerMatriculas();
  }
}
