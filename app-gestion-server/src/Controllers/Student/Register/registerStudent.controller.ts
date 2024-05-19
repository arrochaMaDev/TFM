import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RegisterStudentService } from './registerStudent.service';
import { RegisterStudentDto } from './registerStudent.dto';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('student')
export class RegisterStudentController {
  constructor(
    private readonly registerStudentService: RegisterStudentService,
  ) {}

  @Post()

  // subir foto
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads', // dentro de la carpeta del server
        filename: (req, file, cb) => {
          const fileName = uuidv4(); // usamos uuid para generar un nombre único para el archivo
          const fileExt = extname(file.originalname); // extraemos la extensión del archivo
          cb(null, `${fileName}.jpg`); // llamamos al callback con el nombre del archivo
          // cb(null, `${fileName}${fileExt}`); // llamamos al callback con el nombre del archivo
        },
      }),
    }),
  )
  async registerStudent(
    @Body() data: RegisterStudentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);
    try {
      if (file != undefined) {
        data.foto = file.filename;
      }
      // const { nombre, apellidos, dni, direccion, telefono, email } = data;
      const studentData = await this.registerStudentService.createStudent(data);

      const student = {
        id: studentData.id,
        nombre: studentData.nombre,
        apellidos: studentData.apellidos,
        dni: studentData.dni,
        direccion: studentData.direccion,
        telefono: studentData.telefono,
        email: studentData.email,
        foto: studentData.foto,
        usuario: {
          id: studentData.userId.id,
          username: studentData.userId.username,
          email: studentData.userId.email,
          permiso: studentData.userId.permiso,
        },
      };
      return student;
    } catch (error) {
      console.error('Error al crear el alumno:', error);
      throw new Error('No se pudo crear el alumno');
    }
  }
}
