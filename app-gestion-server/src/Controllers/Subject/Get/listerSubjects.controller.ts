import { Controller, Get } from '@nestjs/common';
import { ListerSubjectsService } from './listerSubjects.service';

@Controller('asignaturas')
export class ListerSubjectsController {
  constructor(
    private readonly listerSubjectsController: ListerSubjectsService,
  ) {}

  @Get()
  async listerSubjects() {
    return this.listerSubjectsController.listerSubjects();
  }
}
