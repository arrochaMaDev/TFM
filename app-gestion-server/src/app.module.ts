import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
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
import { GetMatriculasByStudentIdService } from './Controllers/Matricula/Get/listerMatriculasByStudentId.service';
import { GetMatriculasByStudentIdController } from './Controllers/Matricula/Get/listerMatriculasByStudentId.controller';
import { UpdateMatriculaController } from './Controllers/Matricula/Update/updateMatricula.controller';
import { UpdateMatriculaService } from './Controllers/Matricula/Update/updateMatricula.service';
import { UpdateUserController } from './Controllers/User/Update/updateUser.controller';
import { UpdateUserService } from './Controllers/User/Update/updateUser.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'app_gestion',
      entities: [StudentDb, TeacherDb, UserDb, SubjectDb, MatriculaDb],
    }),
    TypeOrmModule.forFeature([
      StudentDb,
      TeacherDb,
      UserDb,
      SubjectDb,
      MatriculaDb,
    ]),
  ],
  controllers: [
    RegisterStudentController,
    RegisterTeacherController,
    RegisterUserController,
    RegisterSubjectController,
    RegisterMatriculaController,
    GetStudentController,
    GetTeacherController,
    GetSubjectController,
    GetUserController,
    GetMatriculaController,
    GetMatriculasByStudentIdController,
    DeleteStudentController,
    DeleteSubjectController,
    DeleteTeacherController,
    DeleteUserController,
    DeleteMatriculaController,
    UpdateStudentController,
    UpdateSubjectController,
    UpdateTeacherController,
    UpdateUserController,
    UpdateMatriculaController,
    ListerStudentsController,
    ListerTeachersController,
    ListerSubjectsController,
    ListerUsersController,
    ListerMatriculasController,
    LoginUserController,
  ], //AppController
  providers: [
    RegisterStudentService,
    RegisterTeacherService,
    RegisterUserService,
    RegisterSubjectService,
    RegisterMatriculaService,
    GetStudentService,
    GetTeacherService,
    GetSubjectService,
    GetUserService,
    GetMatriculaService,
    GetMatriculasByStudentIdService,
    DeleteStudentService,
    DeleteSubjectService,
    DeleteTeacherService,
    DeleteUserService,
    DeleteMatriculaService,
    UpdateStudentService,
    UpdateSubjectService,
    UpdateTeacherService,
    UpdateUserService,
    UpdateMatriculaService,
    ListerStudentsService,
    ListerTeachersService,
    ListerSubjectsService,
    ListerUsersService,
    ListerMatriculasService,
    LoginUserService,
  ],
})
export class AppModule {}
