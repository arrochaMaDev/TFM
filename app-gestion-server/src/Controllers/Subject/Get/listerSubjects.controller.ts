import { Controller, Get } from '@nestjs/common';
import { ListerSubjectsService } from './listerSubjects.service';

@Controller('asignaturas')
export class ListerSubjectsController {
  constructor(
    private readonly ListerSubjectsController: ListerSubjectsService,
  ) {}

  @Get()
  async listerSubjects() {
    return this.ListerSubjectsController.listerSubjects();
  }
}
