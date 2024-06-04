export class ActiveEvaluacion {
  constructor(
    private readonly id: number,
    private readonly activeEval1: number,
    private readonly activeEval2: number,
    private readonly activeEval3: number,
  ) {}

  getId(): number {
    return this.id;
  }

  getactiveEval1(): number {
    return this.activeEval1;
  }

  getactiveEval2(): number {
    return this.activeEval2;
  }

  getactiveEval3(): number {
    return this.activeEval3;
  }
}
