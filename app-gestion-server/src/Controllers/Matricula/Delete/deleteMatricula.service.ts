import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}

  // BORRAR MATRICULAS POR ID DE MATRICULA
  async deleteMatricula(id: number): Promise<MatriculaDb | null> {
    // se pone null para gestionar mejor si no se obtiene ninguna matricula, porque si no, devuelve undefined
    const matricula = await this.matriculaRepository
      .createQueryBuilder('matricula')
      .leftJoinAndSelect('matricula.student', 'student')
      .leftJoinAndSelect('matricula.subject', 'subject')
      .leftJoinAndSelect('matricula.teacher', 'teacher')
      .where('matricula.id = :id', { id })
      .getOne();

    if (!matricula) {
      throw new Error('Matricula no encontrada');
    }
    console.log(matricula);

    return await this.matriculaRepository.remove(matricula);
  }

  // BORRAR MATRICULAS POR ID DE STUDENT
  async deleteMatriculasByStudentId(studentId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        student: { id: studentId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    if (!matriculas) {
      throw new Error('Matriculas no encontradas');
    }
    console.log(matriculas);

    return await this.matriculaRepository.remove(matriculas);
  }

  // BORRAR MATRICULAS POR ID DE PROFESOR
  async deleteMatriculasByTeacherId(teacherId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        teacher: { id: teacherId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    if (!matriculas) {
      throw new Error('Matriculas no encontradas');
    }
    console.log(matriculas);

    return await this.matriculaRepository.remove(matriculas);
  }

  // BORRAR MATRICULAS POR ID DE ASIGNATURA
  async deleteMatriculasBySubjectId(subjectId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        subject: { id: subjectId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    if (!matriculas) {
      throw new Error('Matriculas no encontradas');
    }
    console.log(matriculas);

    return await this.matriculaRepository.remove(matriculas);
  }
}
