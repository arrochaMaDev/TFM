import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/Modelos/Teacher/teacher';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterTeacherService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
  ) {}

  async createTeacher(
    nombre: string,
    apellidos: string,
    email: string,
    asignaturas: string,
  ) {
    const usuario_uuid = await uuidv4();
    console.log(usuario_uuid);

    const teacher = new Teacher(
      0, //id
      usuario_uuid,
      nombre,
      apellidos,
      email,
      asignaturas,
    );
    console.log(teacher);

    const teacherDb: TeacherDb = {
      id: teacher.getId(),
      usuario_id: teacher.getUsuario_id(),
      nombre: teacher.getNombre(),
      apellidos: teacher.getApellidos(),
      email: teacher.getEmail(),
      asignaturas: teacher.getAsignaturas(),
    };
    console.log(teacherDb);

    // await this.teacherRepository.save(teacherDb);
    await this.teacherRepository.insert(teacherDb);
  }
}
