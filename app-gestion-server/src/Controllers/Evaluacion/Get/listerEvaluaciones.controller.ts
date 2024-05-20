import { Controller, Get, Res } from '@nestjs/common';
import { ListerEvaluacionesService } from './listerEvaluaciones.service';

@Controller('evaluaciones')
export class ListerEvaluacionesController {
  constructor(
    private readonly listerEvaluacionesService: ListerEvaluacionesService,
  ) {}

  @Get()
  async listerEvaluaciones() {
    return this.listerEvaluacionesService.listerEvaluaciones();
  }
}
