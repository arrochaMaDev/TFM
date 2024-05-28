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
    // year: number,
  ) {
    try {
      const {
        alumno,
        asignatura,
        profesor,
        year,
        nota1,
        comentario1,
        nota2,
        comentario2,
        nota3,
        comentario3,
      } = data;

      // Obtengo los objetos alumno, asignatura y profesor completos
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
        year,
        nota1,
        comentario1,
        nota2,
        comentario2,
        nota3,
        comentario3,
      );
      console.log(matricula);

      // Opción con el método create. Crea un objeto con los parámetros de la entidad de matriculaRepository, similar a new Matricula:

      // const matricula = this.matriculaRepository.create({
      //   // El método create
      //   student: { id: alumno },
      //   subject: { id: asignatura },
      //   teacher: { id: profesor },
      //   year,
      //   nota1,
      //   comentario1,
      //   nota2,
      //   comentario2,
      //   nota3,
      //   comentario3,
      // });
      // const matriculaJSON = JSON.stringify(matricula);
      // console.table(matriculaJSON);

      const matriculaDb: Partial<MatriculaDb> = {
        id: matricula.getId(),
        student: matricula.getAlumno(),
        subject: matricula.getAsignatura(),
        teacher: matricula.getProfesor(),
        year: matricula.getYear(),
        nota1: matricula.getNota1(),
        comentario1: matricula.getComentario1(),
        nota2: matricula.getNota2(),
        comentario2: matricula.getComentario2(),
        nota3: matricula.getNota3(),
        comentario3: matricula.getComentario3(),
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
