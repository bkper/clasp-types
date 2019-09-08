export abstract class Definition {
  public name: string;
  public depth: number;
  constructor(name: string, depth: number) {
    this.name = name;
    this.depth = depth;
  }
}