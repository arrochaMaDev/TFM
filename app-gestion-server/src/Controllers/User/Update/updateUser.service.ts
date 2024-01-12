import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDb } from 'src/Modelos/User/userDb';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userRepository: Repository<UserDb>,
  ) {}

  async updateUser(id: number, newData: Partial<UserDb>): Promise<UserDb> {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      throw new Error('Profesor no encontrado');
    }

    // Actualiza los campos del usuario con newData
    // Object.assign(userToUpdate, newData);
    // en vez de usar el método Object.assign, uso merge:

    // Si quiero cambiar la pass, hasheo la contraseña
    if (newData.pass) {
      const passHasheada = await argon2.hash(newData.pass);
      newData.pass = passHasheada;
    }

    const updatedUser = this.userRepository.merge(userToUpdate, newData);

    // Guarda los cambios en la base de datos
    await this.userRepository.save(updatedUser);

    return userToUpdate;
  }
}
