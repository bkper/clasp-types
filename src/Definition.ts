import { Builder } from "./Builder";
export abstract class Definition {

  public name: string;
  public depth: number;

  constructor(name: string, depth: number, node: any) {
    this.name = name;
    this.depth = depth;
  }

  abstract parse(node: any): void;
  abstract build(builder: Builder, depth: number): void;

  
}