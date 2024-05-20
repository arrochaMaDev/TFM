import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/Modelos/Teacher/teacher';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { UserDb } from 'src/Modelos/User/userDb';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterTeacherDto } from './registerTeacher.dto';
import { GetUserService } from '../../User/Get/getUser.service';

@Injectable()
export class RegisterTeacherService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
    private readonly getUserService: GetUserService,
  ) {}

  async createTeacher(
    data: RegisterTeacherDto,
    // nombre: string,
    // apellidos: string,
    // email: string,
    // asignaturas: string,
    // userId: UserDb,
  ) {
    try {
      const {
        nombre,
        apellidos,
        dni,
        direccion,
        telefono,
        email,
        foto,
        userId,
      } = data;

      const usuario_uuid = await uuidv4();
      console.log(usuario_uuid);

      // Obtengo el objeto usuario con el id añadido
      const usuario_id = await this.getUserService.getUser(userId);
      console.log(usuario_id);

      const teacher = new Teacher(
        0, //id
        usuario_uuid,
        nombre,
        apellidos,
        dni,
        direccion,
        telefono,
        email,
        foto,
        usuario_id,
      );
      console.log(teacher);

      const teacherDb: Partial<TeacherDb> = {
        id: teacher.getId(),
        usuario_id: teacher.getUsuario_id(),
        nombre: teacher.getNombre(),
        apellidos: teacher.getApellidos(),
        dni: teacher.getDni().toUpperCase(), // se pasa la letra a mayúscula
        direccion: teacher.getDireccion(),
        telefono: teacher.getTelefono(),
        email: teacher.getEmail(),
        foto: teacher.getFoto(),
        userId: teacher.getUserId(),
      };
      console.log(teacherDb);

      // await this.teacherRepository.save(teacherDb);
      await this.teacherRepository.insert(teacherDb);

      return teacherDb;
    } catch (error) {
      console.error('Error al crear el profesor:', error);
      throw new Error('No se pudo crear el profesor');
    }
  }
}
