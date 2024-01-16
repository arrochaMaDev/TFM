import { Controller, Get } from '@nestjs/common';
import { listerSubjectsTeachersService } from './listerSubjectsTeachers.service';

@Controller('asignaturas_profesores')
export class listerSubjectsTeachersController {
  constructor(
    private listerSubjectsTeachersService: listerSubjectsTeachersService,
  ) {}

  @Get()
  async ListerMatriculas() {
    return this.listerSubjectsTeachersService.listerSubjectTeachers();
  }
}
