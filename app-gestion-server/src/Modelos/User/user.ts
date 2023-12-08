export class User {
  constructor(
    private readonly id: number,
    private readonly username: string, // https://www.uuidgenerator.net/dev-corner/typescript
    private readonly email: string,
    private readonly pass: string,
    private readonly permiso: number,
  ) {}

  getId(): number {
    return this.id;
  }
  getUsername(): string {
    return this.username;
  }
  getEmail(): string {
    return this.email;
  }
  getPass(): string {
    return this.pass;
  }
  getPermiso(): number {
    return this.permiso;
  }
}
