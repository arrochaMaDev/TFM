import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/Modelos/Student/student';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterStudentService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentRepository: Repository<StudentDb>,
  ) {}

  async createStudent(
    nombre: string,
    apellidos: string,
    dni: string,
    direccion: string,
    telefono: number,
    email: string,
  ) {
    const usuario_uuid = await uuidv4();
    console.log(usuario_uuid);

    const student = new Student(
      0, //id
      usuario_uuid,
      nombre,
      apellidos,
      dni,
      direccion,
      telefono,
      email,
    );
    console.log(student);

    const studentDb: Partial<StudentDb> = {
      id: student.getId(),
      usuario_id: student.getUsuario_id(),
      nombre: student.getNombre(),
      apellidos: student.getApellidos(),
      dni: student.getDni(),
      direccion: student.getDireccion(),
      telefono: student.getTelefono(),
      email: student.getEmail(),
    };
    console.log(studentDb);

    await this.studentRepository.insert(studentDb); // con insert no se verifica si hay un usuario existente
    // await this.studentRepository.save(studentDb); // con save, si el usuario existe lo actualiza
  }
}
