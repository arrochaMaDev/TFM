import {
  Controller,
  Put,
  Body,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { UpdateStudentService } from './UpdateStudent.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('student')
export class UpdateStudentController {
  constructor(private readonly updateStudentService: UpdateStudentService) {}

  @Put(':id')

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
  async updateStudent(
    @Param('id') id: number,
    @Body() updatedData: Partial<StudentDb>,
    @Res() response: Response,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log(file);

    try {
      if (file != undefined) {
        updatedData.foto = file.filename;
      }
      if (file == null) {
        updatedData.foto = null;
      }
      const updatedStudent = await this.updateStudentService.updateStudent(
        Number(id),
        updatedData,
      );
      response.status(200).json(updatedStudent); // Devuelve el estudiante actualizado
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
