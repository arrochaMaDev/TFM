import { Controller, Get } from '@nestjs/common';
import { ListerTeachersService } from './listerTeachers.service';

@Controller('teachers')
export class ListerTeachersController {
  constructor(private readonly ListerTeachersService: ListerTeachersService) {}

  @Get()
  async listerTeachers() {
    return this.ListerTeachersService.listerTeachers();
  }
}
