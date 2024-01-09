import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateSubjectService {
  constructor(
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
  ) {}

  async updateSubject(
    id: number,
    newData: Partial<SubjectDb>,
  ): Promise<SubjectDb> {
    const subjectToUpdate = await this.subjectRepository.findOne({
      where: { id },
    });

    if (!subjectToUpdate) {
      throw new Error('Asignatura no encontrada');
    }

    // Actualiza los campos de la asignatura con newData
    Object.assign(subjectToUpdate, newData);

    // Guarda los cambios en la base de datos
    await this.subjectRepository.save(subjectToUpdate);

    return subjectToUpdate;
  }
}
