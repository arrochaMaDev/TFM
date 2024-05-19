import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterStudentService } from './registerStudent.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('fotoStudent')
export class UploadFileController {
  constructor(
    private readonly registerStudentService: RegisterStudentService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads', // dentro de la carpeta del server
        filename: (req, file, cb) => {
          const fileName = uuidv4(); // usamos uuid para generar un nombre único para el archivo
          // const fileExt = extname(file.originalname); // extraemos la extensión del archivo
          cb(null, `${fileName}.jpg`); // llamamos al callback con el nombre del archivo
          // cb(null, `${fileName}${fileExt}`); // llamamos al callback con el nombre del archivo
        },
      }),
    }),
  )
  async registerStudent(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
