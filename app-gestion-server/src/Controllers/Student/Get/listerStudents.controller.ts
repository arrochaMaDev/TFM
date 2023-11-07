import { Controller, Get } from '@nestjs/common';
import { ListerStudentsService } from './listerStudents.service';

@Controller('students')
export class ListerStudentsController {
  constructor(private readonly ListerStudentsService: ListerStudentsService) {}

  @Get()
  async listerStudents() {
    return this.ListerStudentsService.listerStudents();
  }
}
