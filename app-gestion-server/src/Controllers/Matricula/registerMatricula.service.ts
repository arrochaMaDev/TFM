import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';
import { RegisterMatriculaDto } from './RegisterMatricula.dto';
import { Matricula } from 'src/Modelos/Matricula/matricula';
import { GetStudentService } from '../Student/Get/getStudent.service';
import { GetSubjectService } from '../Subject/Get/getSubject.service';
import { GetTeacherService } from '../Teacher/Get/getTeacher.service';

@Injectable()
export class RegisterMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
    private readonly getStudentService: GetStudentService,
    private readonly getSubjectService: GetSubjectService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  async createMatricula(data: RegisterMatriculaDto) {
    try {
      const { alumno, asignatura, profesor, nota } = data;

      const student = await this.getStudentService.getStudent(alumno);
      const subject = await this.getSubjectService.getSubject(asignatura);
      const teacher = await this.getTeacherService.getTeacher(profesor);

      const matricula = this.matriculaRepository.create({
        student: { id: alumno },
        subject: { id: asignatura },
        teacher: { id: profesor },
        nota,
      });

      await this.matriculaRepository.insert(matricula);

      return matricula;
    } catch (error) {
      console.error('Error al crear la matrícula:', error);
      throw new Error('No se pudo crear la matrícula');
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
// import { Any, Repository } from 'typeorm';
// import { Matricula } from 'src/Modelos/Matricula/matricula';
// import { GetStudentService } from '../Student/Get/getStudent.service';
// import { GetTeacherService } from '../Teacher/Get/getTeacher.service';
// import { GetSubjectService } from '../Subject/Get/getSubject.service';
// import { Subject } from 'src/Modelos/Subject/subject';
// import { Student } from 'src/Modelos/Student/student';
// import { Teacher } from 'src/Modelos/Teacher/teacher';
// import { RegisterMatriculaDto } from './RegisterMatricula.dto';

// @Injectable()
// export class RegisterMatriculaService {
//   constructor(
//     @InjectRepository(MatriculaDb)
//     private readonly matriculaRepository: Repository<MatriculaDb>,
//     private readonly getStudentService: GetStudentService,
//     private readonly getSubjectService: GetSubjectService,
//     private readonly getTeacherService: GetTeacherService,
//   ) {}

//   async createMatricula(
//     alumno: number,
//     asignatura: number,
//     profesor: number,
//     nota: number,
//   ) {
//     const matricula = new Matricula(0, alumno, asignatura, profesor, nota);
//     console.log(matricula);

//     try {
//       const matriculaDb: MatriculaDb = {
//         id: matricula.getId(),
//         student: matricula.getAlumnoId(),
//         subject: matricula.getAsignaturaId(),
//         teacher: matricula.getProfesorId(),
//         nota: matricula.getNota(),
//       };
//       console.log(matriculaDb);

//       const nombreAlumno = (
//         await this.getStudentService.getStudent(matriculaDb.student)
//       ).nombre;

//       const nombreAsignatura = (
//         await this.getSubjectService.getSubject(matriculaDb.subject)
//       ).nombre;

//       const nombreProfesor = (
//         await this.getTeacherService.getTeacher(matriculaDb.teacher)
//       ).nombre;

//       const matriculaDbToNames = {
//         nombreAlumno,
//         nombreAsignatura,
//         nombreProfesor,
//         nota,
//       };

//       await this.matriculaRepository.insert(matriculaDb);
//       return matriculaDbToNames;
//     } catch (error) {
//       console.error('Error al crear la matrícula:', error);
//       throw new Error('No se pudo crear la matrícula');
//     }
//   }
// }
