export class EvaluacionActiva {
  constructor(
    private readonly id: number,
    private readonly evaluacion1: number,
    private readonly evaluacion2: number,
    private readonly evaluacion3: number,
  ) {}

  getId(): number {
    return this.id;
  }

  getEvaluacion1(): number {
    return this.evaluacion1;
  }

  getEvaluacion2(): number {
    return this.evaluacion2;
  }

  getEvaluacion3(): number {
    return this.evaluacion3;
  }
}
