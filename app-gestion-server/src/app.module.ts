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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'app_gestion',
      entities: [StudentDb, TeacherDb, UserDb],
    }),
    TypeOrmModule.forFeature([StudentDb, TeacherDb, UserDb]),
  ],
  controllers: [
    RegisterStudentController,
    RegisterTeacherController,
    RegisterUserController,
    GetStudentController,
    GetTeacherController,
    DeleteStudentController,
    UpdateStudentController,
    ListerStudentsController,
    ListerTeachersController,
    LoginUserController,
  ], //AppController
  providers: [
    RegisterStudentService,
    RegisterTeacherService,
    RegisterUserService,
    GetStudentService,
    GetTeacherService,
    DeleteStudentService,
    UpdateStudentService,
    ListerStudentsService,
    ListerTeachersService,
    LoginUserService,
  ],
})
export class AppModule {}
