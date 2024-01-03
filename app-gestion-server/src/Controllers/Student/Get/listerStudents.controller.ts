import { Controller, Get } from '@nestjs/common';
import { ListerStudentsService } from './listerStudents.service';

@Controller('students')
export class ListerStudentsController {
  constructor(private readonly listerStudentsService: ListerStudentsService) {}

  @Get()
  async listerStudents() {
    return this.listerStudentsService.listerStudents();
  }
}
