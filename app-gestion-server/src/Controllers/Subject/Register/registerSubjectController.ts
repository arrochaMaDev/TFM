import { Body, Controller, Post } from '@nestjs/common';
import { RegisterSubjectService } from './registerSubjectService';
import { RegisterSubjectDto } from './registerSubjectDto';

@Controller('asignaturas')
export class RegisterSubjectController {
  constructor(
    private readonly registerSubjectService: RegisterSubjectService,
  ) {}

  @Post()
  async registerSubject(@Body() data: RegisterSubjectDto) {
    const { nombre } = data;
    await this.registerSubjectService.createSubject(nombre);
  }
}
