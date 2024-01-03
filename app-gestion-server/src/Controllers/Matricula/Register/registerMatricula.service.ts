import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';
import { RegisterMatriculaDto } from './RegisterMatricula.dto';
import { Matricula } from 'src/Modelos/Matricula/matricula';
import { GetStudentService } from '../../Student/Get/getStudent.service';
import { GetSubjectService } from '../../Subject/Get/getSubject.service';
import { GetTeacherService } from '../../Teacher/Get/getTeacher.service';

@Injectable()
export class RegisterMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
    private readonly getStudentService: GetStudentService,
    private readonly getSubjectService: GetSubjectService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  async createMatricula(
    data: RegisterMatriculaDto,
    // alumno: number,
    // asignatura: number,
    // profesor: number,
    // nota: number,
  ) {
    try {
      const {
        alumno,
        asignatura,
        profesor,
        // nota
        // EL CAMPO NOTA SE RESERVA PARA LA EVALUACION
      } = data;

      const student = await this.getStudentService.getStudent(alumno);
      console.log(student);

      const subject = await this.getSubjectService.getSubject(asignatura);
      console.log(subject);

      const teacher = await this.getTeacherService.getTeacher(profesor);
      console.log(teacher);

      const matricula = new Matricula(
        0, // id
        student,
        subject,
        teacher,
        // nota,
      );
      console.log(matricula);

      // const matricula = this.matriculaRepository.create({
      //   // El método create crea un objeto con los parámetros de la entidad de matriculaRepository, similar a new Matricula
      //   student: { id: alumno },
      //   subject: { id: asignatura },
      //   teacher: { id: profesor },
      //   nota,
      // });
      // const matriculaJSON = JSON.stringify(matricula);
      // console.table(matriculaJSON);

      const matriculaDb: Partial<MatriculaDb> = {
        id: matricula.getId(),
        student: matricula.getAlumno(),
        subject: matricula.getAsignatura(),
        teacher: matricula.getProfesor(),
        // nota: matricula.getNota(),
      };
      console.table(matriculaDb);

      await this.matriculaRepository.insert(matriculaDb);

      return matriculaDb;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}
