import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDb } from 'src/Modelos/User/userDb';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from 'src/Modelos/User/user';

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userRepository: Repository<UserDb>,
  ) {}

  async createUser(
    username: string,
    email: string,
    pass: string,
    permiso: number,
  ) {
    const passHasheada = await argon2.hash(pass);
    console.log(passHasheada);

    const user = new User(0, username, email, passHasheada, permiso);
    console.log(user);

    const userDb: UserDb = {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      pass: user.getPass(),
      permisos: user.getPermisos(),
    };
    console.log(userDb);

    await this.userRepository.save(userDb);
  }
}
