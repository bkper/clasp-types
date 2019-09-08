import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Enum extends Definition {

  constructor(node: TypedocJsonNode, depth: number) {
    super(node, depth);
  }

  build(builder: Builder, depth: number): void {
  }
  
}