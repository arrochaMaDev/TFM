import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterTeacherDto } from './registerTeacher.dto';
import { RegisterTeacherService } from './registerteacher.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('teacher')
export class RegisterTeacherController {
  constructor(
    private readonly registerTeacherService: RegisterTeacherService,
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
          cb(null, `${fileName}.jpg`); // llamamos al callback con el nombre del archivo y añadimos la extension .jpg
          // cb(null, `${fileName}${fileExt}`); // llamamos al callback con el nombre del archivo
        },
      }),
    }),
  )
  async registerTeacher(
    @Body() data: RegisterTeacherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);
    try {
      if (file != undefined) {
        data.foto = file.filename;
      }
      // const { nombre, apellidos, email, asignaturas, userId } = data;
      const teacherData = await this.registerTeacherService.createTeacher(data);

      const teacher = {
        id: teacherData.id,
        nombre: teacherData.nombre,
        apellidos: teacherData.apellidos,
        dni: teacherData.dni,
        direccion: teacherData.direccion,
        telefono: teacherData.telefono,
        email: teacherData.email,
        foto: teacherData.foto,
        usuario: {
          id: teacherData.userId.id,
          username: teacherData.userId.username,
          email: teacherData.userId.email,
          permiso: teacherData.userId.permiso,
        },
      };
      // return teacherData;
      return teacher;
    } catch (error) {
      console.error('Error al crear el profesor:', error);
      throw new Error('No se pudo crear el profesor');
    }
  }
}
