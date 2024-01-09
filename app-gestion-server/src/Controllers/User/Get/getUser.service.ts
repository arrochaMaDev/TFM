import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDb } from 'src/Modelos/User/userDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(UserDb)
    private readonly userRepository: Repository<UserDb>,
  ) {}

  async getUser(id: number): Promise<UserDb> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    console.log(user);
    return user;
  }
}
