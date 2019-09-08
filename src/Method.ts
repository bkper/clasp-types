import { Definition } from "./Definition";
import { Builder } from "./Builder";

export class Method extends Definition {

  constructor(name: string, depth: number, node: any) {
    super(name, depth, node);
  }

  parse(node: any): void {
  }
  build(builder: Builder, depth: number): void {
  }
}