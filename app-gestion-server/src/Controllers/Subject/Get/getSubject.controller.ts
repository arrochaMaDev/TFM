import { Controller, Get, Param, Res } from '@nestjs/common';
import { GetSubjectService } from './getSubject.service';
import { Response } from 'express';

@Controller('asignatura')
export class GetSubjectController {
  constructor(private readonly getSubjectService: GetSubjectService) {}

  @Get(':id')
  async getSubject(@Param('id') id: number, @Res() response: Response) {
    const subject = await this.getSubjectService.getSubject(Number(id));
    const subjectDto = {
      id: subject.id,
      nombre: subject.nombre,
    };
    response.send(subjectDto).status(200);
  }
}
