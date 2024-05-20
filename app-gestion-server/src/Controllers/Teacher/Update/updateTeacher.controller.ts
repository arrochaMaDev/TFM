import {
  Controller,
  Put,
  Param,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateTeacherService } from './updateTeacher.service';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('teacher')
export class UpdateTeacherController {
  constructor(private readonly updateTeacherService: UpdateTeacherService) {}

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
  async updateTeacher(
    @Param('id') id: number,
    @Body() updatedData: Partial<TeacherDb>,
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
      const updatedTeacher = await this.updateTeacherService.updateTeacher(
        Number(id),
        updatedData,
      );
      response.status(200).json(updatedTeacher); // Devuelve el profesor actualizado
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
