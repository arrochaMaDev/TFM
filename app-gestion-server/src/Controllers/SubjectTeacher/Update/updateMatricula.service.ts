// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
// import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
// import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
// import { Repository } from 'typeorm';
// import { GetMatriculaService } from '../Get/getSubjectTeacher.service';

// @Injectable()
// export class UpdateMatriculaService {
//   constructor(
//     @InjectRepository(MatriculaDb)
//     private readonly matriculaRepository: Repository<MatriculaDb>,
//     @InjectRepository(TeacherDb)
//     private readonly teacherRepository: Repository<TeacherDb>,
//     @InjectRepository(SubjectDb)
//     private readonly subjectRepository: Repository<SubjectDb>,
//     private readonly getMatriculaService: GetMatriculaService,
//   ) {}
//   // Solo existen 2 opciones: se actualiza la el ID de la asignatura o el ID profesor
//   async updateMatricula(
//     matriculaId: number,
//     subject?: Partial<SubjectDb>, // solo se pasa el id, pero se maneja como un objeto en vez de con un number
//     teacher?: Partial<TeacherDb>,
//   ): Promise<MatriculaDb> {
//     try {
//       // OBTENGO LA MATRICULA A ACTUALIZAR
//       const matriculaToUpdate =
//         await this.getMatriculaService.getMatricula(matriculaId);

//       // MODIFICO EL PROFESOR A PARTIR DEL ID
//       if (teacher) {
//         const newTeacher = await this.teacherRepository.findOne({
//           where: {
//             id: teacher.id,
//           },
//         });
//         matriculaToUpdate.teacher = newTeacher;

//         if (!teacher) {
//           throw new Error('Profesor no encontrado');
//         }
//       }
//       // MODIFICO LA ASIGNATURA A PARTIR DEL ID
//       if (subject) {
//         const newSubject = await this.subjectRepository.findOne({
//           where: {
//             id: subject.id,
//           },
//         });
//         matriculaToUpdate.subject = newSubject;

//         if (!subject) {
//           throw new Error('Asignatura no encontrada');
//         }
//       }
//       return this.matriculaRepository.save(matriculaToUpdate);
//     } catch (error) {
//       console.error('Error al actualizar la matrícula:', error);
//       throw new Error('No se pudo actualizar la matrícula');
//     }
//   }
// }
