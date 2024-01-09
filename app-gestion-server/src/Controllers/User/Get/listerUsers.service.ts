import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDb } from 'src/Modelos/User/userDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerUsersService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userRepository: Repository<UserDb>,
  ) {}

  async listerUsers(): Promise<UserDb[]> {
    const listado = await this.userRepository.find();
    console.log(listado);
    return listado;
  }
}
