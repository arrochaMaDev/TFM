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

  async login(email: string, pass: string): Promise<boolean> {
    const usuarios: UserDb[] = await this.userRepository.findBy({
      email: email,
    });

    return await argon2.verify(usuarios[0].pass, pass);
  }
}
