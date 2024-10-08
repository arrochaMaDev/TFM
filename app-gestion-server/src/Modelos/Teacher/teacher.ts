// import { v4 as uuidv4 } from 'uuid';

import { UserDb } from '../User/userDb';

export class Teacher {
  constructor(
    private readonly id: number,
    private readonly usuario_id: string, // https://www.uuidgenerator.net/dev-corner/typescript
    private readonly nombre: string,
    private readonly apellidos: string,
    private readonly email: string,
    private readonly asignaturas: string,
    private readonly userId: UserDb,
  ) {}

  getId(): number {
    return this.id;
  }
  getUsuario_id(): string {
    return this.usuario_id;
  }
  getNombre(): string {
    return this.nombre;
  }
  getApellidos(): string {
    return this.apellidos;
  }
  getEmail(): string {
    return this.email;
  }
  getAsignaturas(): string {
    return this.asignaturas;
  }
  getUserId(): UserDb {
    return this.userId;
  }
}
