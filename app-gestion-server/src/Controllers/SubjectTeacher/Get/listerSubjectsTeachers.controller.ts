import { Controller, Get } from '@nestjs/common';
import { ListerSubjectsTeachersService } from './listerSubjectsTeachers.service';

@Controller('asignaturas_profesores')
export class ListerSubjectsTeachersController {
  constructor(
    private listerSubjectsTeachersService: ListerSubjectsTeachersService,
  ) {}

  @Get()
  async ListerMatriculas() {
    return this.listerSubjectsTeachersService.listerSubjectTeachers();
  }
}
