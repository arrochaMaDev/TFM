import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//Entidades, controladores y servicios:
import { RegisterStudentService } from './Controllers/Student/Register/registerStudent.service';
import { RegisterStudentController } from './Controllers/Student/Register/registerStudent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentDb } from './Modelos/Student/studentDb';
import { RegisterTeacherController } from './Controllers/Teacher/Register/registerTeacher.controller';
import { RegisterTeacherService } from './Controllers/Teacher/Register/registerteacher.service';
import { TeacherDb } from './Modelos/Teacher/teacherDb';
import { ListerStudentsController } from './Controllers/Student/Get/listerStudents.controller';
import { ListerStudentsService } from './Controllers/Student/Get/listerStudents.service';
import { GetStudentController } from './Controllers/Student/Get/getStudent.controller';
import { GetStudentService } from './Controllers/Student/Get/getStudent.service';
import { ListerTeachersController } from './Controllers/Teacher/Get/listerTeachers.controller';
import { ListerTeachersService } from './Controllers/Teacher/Get/listerTeachers.service';
import { RegisterUserController } from './Controllers/User/Register/registerUser.controller';
import { RegisterUserService } from './Controllers/User/Register/registerUser.service';
import { UserDb } from './Modelos/User/userDb';
import { LoginUserController } from './Controllers/User/Login/loginUser.controller';
import { LoginUserService } from './Controllers/User/Login/loginUser.service';
import { DeleteStudentController } from './Controllers/Student/Delete/deleteStudent.controller';
import { DeleteStudentService } from './Controllers/Student/Delete/deleteStudent.service';
import { GetTeacherController } from './Controllers/Teacher/Get/getTeacher.controller';
import { GetTeacherService } from './Controllers/Teacher/Get/getTeacher.service';
import { UpdateStudentService } from './Controllers/Student/Update/UpdateStudent.service';
import { UpdateStudentController } from './Controllers/Student/Update/updateStudent.controller';
import { RegisterSubjectController } from './Controllers/Subject/Register/registerSubjectController';
import { RegisterSubjectService } from './Controllers/Subject/Register/registerSubjectService';
import { SubjectDb } from './Modelos/Subject/subjectDb';
import { ListerSubjectsController } from './Controllers/Subject/Get/listerSubjects.controller';
import { ListerSubjectsService } from './Controllers/Subject/Get/listerSubjects.service';
import { GetSubjectController } from './Controllers/Subject/Get/getSubject.controller';
import { GetSubjectService } from './Controllers/Subject/Get/getSubject.service';
import { DeleteSubjectController } from './Controllers/Subject/Delete/deleteSubject.controller';
import { DeleteSubjectService } from './Controllers/Subject/Delete/deleteSubject.service';
import { UpdateSubjectController } from './Controllers/Subject/Update/updateSubject.controller';
import { UpdateSubjectService } from './Controllers/Subject/Update/updateSubject.service';
import { RegisterMatriculaService } from './Controllers/Matricula/Register/registerMatricula.service';
import { MatriculaDb } from './Modelos/Matricula/matriculaDb';
import { ListerMatriculasController } from './Controllers/Matricula/Get/listerMatriculas.controller';
import { ListerMatriculasService } from './Controllers/Matricula/Get/listerMatriculas.service';
import { RegisterMatriculaController } from './Controllers/Matricula/Register/registerMatricula.controller';
import { GetMatriculaController } from './Controllers/Matricula/Get/getMatricula.controller';
import { GetMatriculaService } from './Controllers/Matricula/Get/getMatricula.service';
import { DeleteMatriculaController } from './Controllers/Matricula/Delete/deleteMatricula.controller';
import { DeleteMatriculaService } from './Controllers/Matricula/Delete/deleteMatricula.service';
import { ListerUsersController } from './Controllers/User/Get/listerUsers.controller';
import { ListerUsersService } from './Controllers/User/Get/listerUsers.service';
import { GetUserService } from './Controllers/User/Get/getUser.service';
import { GetUserController } from './Controllers/User/Get/getUser.controller';
import { UpdateTeacherController } from './Controllers/Teacher/Update/updateTeacher.controller';
import { UpdateTeacherService } from './Controllers/Teacher/Update/updateTeacher.service';
import { DeleteTeacherService } from './Controllers/Teacher/Delete/deleteTeacher.service';
import { DeleteTeacherController } from './Controllers/Teacher/Delete/DeleteTeacher.controller';
import { DeleteUserController } from './Controllers/User/Delete/deleteUser.controller';
import { DeleteUserService } from './Controllers/User/Delete/deleteUser.service';
import { ListerMatriculasByStudentIdService } from './Controllers/Matricula/Get/listerMatriculasByStudentId.service';
import { ListerMatriculasByStudentIdController } from './Controllers/Matricula/Get/listerMatriculasByStudentId.controller';
import { UpdateMatriculaController } from './Controllers/Matricula/Update/updateMatricula.controller';
import { UpdateMatriculaService } from './Controllers/Matricula/Update/updateMatricula.service';
import { UpdateUserController } from './Controllers/User/Update/updateUser.controller';
import { UpdateUserService } from './Controllers/User/Update/updateUser.service';
import { SubjectTeacherDb } from './Modelos/SubjectTeacher/subjectTeacherDb';
import { RegisterSubjectTeacherController } from './Controllers/SubjectTeacher/Register/registerSubjectTeacher.controller';
import { RegisterSubjectTeacherService } from './Controllers/SubjectTeacher/Register/registerSubjectTeacher.service';
import { ListerSubjectsTeachersController } from './Controllers/SubjectTeacher/Get/listerSubjectsTeachers.controller';
import { ListerSubjectsTeachersService } from './Controllers/SubjectTeacher/Get/listerSubjectsTeachers.service';
import { GetSubjectteacherController } from './Controllers/SubjectTeacher/Get/getSubjectTeacher.controller';
import { GetSubjectTeacherService } from './Controllers/SubjectTeacher/Get/getSubjectTeacher.service';
import { ListerSubjectsByTeacherIdController } from './Controllers/SubjectTeacher/Get/listerSubjectsByTeacherId.controller';
import { ListerSubjectsByTeacherIdService } from './Controllers/SubjectTeacher/Get/listerSubjectsByTeacherId.service';
import { ListerTeachersBySubjectIdController } from './Controllers/SubjectTeacher/Get/listerTeachersBySubjectId.controller';
import { ListerTeachersBySubjectIdService } from './Controllers/SubjectTeacher/Get/listerTeachersBySubjectId.service';
import { DeleteSubjectTeacherController } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacher.controller';
import { DeleteSubjectTeacherService } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacher.service';
import { DeleteSubjectTeacherBySubjectIdService } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacherBySubjectId.service';
import { DeleteSubjectTeacherBySubjectIdController } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacherBySubjectId.controller';
import { DeleteSubjectTeacherByTeacherIdController } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacherByTeacherId.controller';
import { DeleteSubjectTeacherByTeacherIdService } from './Controllers/SubjectTeacher/Delete/deleteSubjectTeacherByTeacherId.service';
import { UpdateSubjectTeacherController } from './Controllers/SubjectTeacher/Update/updateSubjectTeacher.controller';
import { UpdateSubjectTeacherService } from './Controllers/SubjectTeacher/Update/updateSubjectTeacher.service';
import { ListerMatriculasByTeacherIdService } from './Controllers/Matricula/Get/listerMatriculasByTeacherId.service';
import { ListerMatriculasByTeacherIdController } from './Controllers/Matricula/Get/listerMatriculasByTeacherId.controller';
import { EvaluacionDb } from './Modelos/Evaluacion/evaluacionDb';
import { RegisterEvaluacionController } from './Controllers/Evaluacion/Register/RegisterEvaluacion.controller';
import { RegisterEvaluacionService } from './Controllers/Evaluacion/Register/RegisterEvaluacion.service';
import { ListerEvaluacionesService } from './Controllers/Evaluacion/Get/listerEvaluaciones.service';
import { ListerEvaluacionesController } from './Controllers/Evaluacion/Get/listerEvaluaciones.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'app_gestion',
      entities: [
        StudentDb,
        TeacherDb,
        UserDb,
        SubjectDb,
        MatriculaDb,
        SubjectTeacherDb,
        EvaluacionDb,
      ],
    }),
    TypeOrmModule.forFeature([
      StudentDb,
      TeacherDb,
      UserDb,
      SubjectDb,
      MatriculaDb,
      SubjectTeacherDb,
      EvaluacionDb,
    ]),
    ServeStaticModule.forRoot({
      // configuración para servir archivos estáticos y ver las imagenes almacenadas en el servidor
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    RegisterStudentController,
    RegisterTeacherController,
    RegisterUserController,
    RegisterSubjectController,
    RegisterMatriculaController,
    RegisterSubjectTeacherController,
    GetStudentController,
    GetTeacherController,
    GetSubjectController,
    GetUserController,
    GetMatriculaController,
    GetSubjectteacherController,
    DeleteStudentController,
    DeleteSubjectController,
    DeleteTeacherController,
    DeleteUserController,
    DeleteMatriculaController,
    DeleteSubjectTeacherController,
    DeleteSubjectTeacherBySubjectIdController,
    DeleteSubjectTeacherByTeacherIdController,
    UpdateStudentController,
    UpdateSubjectController,
    UpdateTeacherController,
    UpdateUserController,
    UpdateMatriculaController,
    UpdateSubjectTeacherController,
    ListerStudentsController,
    ListerTeachersController,
    ListerSubjectsController,
    ListerUsersController,
    ListerMatriculasController,
    ListerMatriculasByStudentIdController,
    ListerMatriculasByTeacherIdController,
    LoginUserController,
    ListerSubjectsTeachersController,
    ListerSubjectsByTeacherIdController,
    ListerTeachersBySubjectIdController,
    RegisterEvaluacionController,
    ListerEvaluacionesController,
  ], //AppController
  providers: [
    RegisterStudentService,
    RegisterTeacherService,
    RegisterUserService,
    RegisterSubjectService,
    RegisterMatriculaService,
    RegisterSubjectTeacherService,
    GetStudentService,
    GetTeacherService,
    GetSubjectService,
    GetUserService,
    GetMatriculaService,
    GetSubjectTeacherService,
    DeleteStudentService,
    DeleteSubjectService,
    DeleteTeacherService,
    DeleteUserService,
    DeleteMatriculaService,
    DeleteSubjectTeacherService,
    DeleteSubjectTeacherBySubjectIdService,
    DeleteSubjectTeacherByTeacherIdService,
    UpdateStudentService,
    UpdateSubjectService,
    UpdateTeacherService,
    UpdateUserService,
    UpdateMatriculaService,
    UpdateSubjectTeacherService,
    ListerStudentsService,
    ListerTeachersService,
    ListerSubjectsService,
    ListerUsersService,
    ListerMatriculasService,
    ListerMatriculasByStudentIdService,
    ListerMatriculasByTeacherIdService,
    LoginUserService,
    ListerSubjectsTeachersService,
    ListerSubjectsByTeacherIdService,
    ListerTeachersBySubjectIdService,
    RegisterEvaluacionService,
    ListerEvaluacionesService,
  ],
})
export class AppModule {}
