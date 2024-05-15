// import { v4 as uuidv4 } from 'uuid';

import { UserDb } from '../User/userDb';

export class Teacher {
  constructor(
    private readonly id: number,
    private readonly usuario_id: string, // https://www.uuidgenerator.net/dev-corner/typescript
    private readonly nombre: string,
    private readonly apellidos: string,
    private readonly dni: string,
    private readonly direccion: string,
    private readonly telefono: number,
    private readonly email: string,
    private readonly foto: string,
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
  getDni(): string {
    return this.dni;
  }
  getDireccion(): string {
    return this.direccion;
  }
  getTelefono(): number {
    return this.telefono;
  }
  getEmail(): string {
    return this.email;
  }
  getFoto(): string {
    return this.foto;
  }
  getUserId(): UserDb {
    return this.userId;
  }
}
