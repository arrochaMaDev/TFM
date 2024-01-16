import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDb } from 'src/Modelos/User/userDb';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

@Injectable()
export class LoginUserService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userRepository: Repository<UserDb>,
  ) {}

  async login(
    email: string,
    pass: string,
  ): Promise<{ isValid: boolean; permiso?: number }> {
    const usuario: UserDb = await this.userRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      return { isValid: false };
    }

    const isValid = await argon2.verify(usuario.pass, pass);

    if (!isValid) {
      return { isValid: false };
    }

    return { isValid: true, permiso: usuario.permiso };
  }
}
