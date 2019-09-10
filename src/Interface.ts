import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Interface extends Definition {

  constructor(node: TypedocJsonNode, depth: number) {
    super(node, depth);
  }
  
  build(builder: Builder, depth: number): void {
    let ident = " ".repeat(depth * 2);
    builder.append(`${ident}export interface ${this.node.name} {`).line()
    builder.append(`${ident}}`).line();
  }
}