import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserService } from 'src/Controllers/User/Get/getUser.service';
import { Student } from 'src/Modelos/Student/student';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterStudentDto } from './registerStudent.dto';

@Injectable()
export class RegisterStudentService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentRepository: Repository<StudentDb>,
    private readonly getUserService: GetUserService,
  ) {}

  async createStudent(
    data: RegisterStudentDto,
    // nombre: string,
    // apellidos: string,
    // dni: string,
    // direccion: string,
    // telefono: number,
    // email: string,
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

      const student = new Student(
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
      console.log(student);

      const studentDb: Partial<StudentDb> = {
        id: student.getId(),
        usuario_id: student.getUsuario_id(),
        nombre: student.getNombre(),
        apellidos: student.getApellidos(),
        dni: student.getDni().toUpperCase(), // se pasa la letra a mayúscula
        direccion: student.getDireccion(),
        telefono: student.getTelefono(),
        email: student.getEmail(),
        foto: student.getFoto(),
        userId: student.getUserId(),
      };
      console.log(studentDb);

      await this.studentRepository.insert(studentDb);
      return studentDb;
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      throw new Error('No se pudo crear el estudiante');
    }
  }
}
