import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';
import { GetMatriculaService } from '../Get/getMatricula.service';

@Injectable()
export class UpdateMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
    private readonly getMatriculaService: GetMatriculaService,
  ) {}
  // Se actualiza a partir del estudiarnte. Por lo tanto, solo existen 2 opciones: se actualiza el ID de la asignatura o el ID del profesor
  async updateMatricula(
    matriculaId: number,
    subject?: Partial<SubjectDb>, // solo se pasa el id, pero se maneja como un objeto en vez de con un number
    teacher?: Partial<TeacherDb>,
    newData?: Partial<MatriculaDb>,
  ): Promise<MatriculaDb> {
    try {
      // OBTENGO LA MATRICULA A ACTUALIZAR A PARTIR DEL ID DE LA MATRICULA
      const matriculaToUpdate =
        await this.getMatriculaService.getMatricula(matriculaId);

      // OBTENGO EL PROFESOR NUEVO A PARTIR DE SU ID
      if (teacher) {
        const newTeacher = await this.teacherRepository.findOne({
          where: {
            id: teacher.id,
          },
        });
        matriculaToUpdate.teacher = newTeacher;

        if (!teacher) {
          throw new Error('Profesor no encontrado');
        }
      }

      // OBTENGO LA ASIGNATURA NUEVA A PARTIR DE SU ID
      if (subject) {
        const newSubject = await this.subjectRepository.findOne({
          where: {
            id: subject.id,
          },
        });
        matriculaToUpdate.subject = newSubject;

        if (!subject) {
          throw new Error('Asignatura no encontrada');
        }
      }

      // SI QUIERO EVALUAR
      if (newData) {
        const evaluarMatricula = this.matriculaRepository.merge(
          matriculaToUpdate,
          newData,
        );
        return this.matriculaRepository.save(evaluarMatricula);
      }

      return this.matriculaRepository.save(matriculaToUpdate);
    } catch (error) {
      console.error('Error al actualizar la matrícula:', error);
      throw new Error('No se pudo actualizar la matrícula');
    }
  }
}
