export class Subject {
  constructor(
    private readonly id: number,
    private readonly nombre: string,
  ) {}

  getId(): number {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }
}
