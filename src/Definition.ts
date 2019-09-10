import { Builder } from "./Builder";
import { TypedocJsonNode } from "./TypedocJsonNode";

export abstract class Definition {

  protected node: TypedocJsonNode;
  protected depth: number;

  constructor(node: TypedocJsonNode, depth: number) {
    this.node = node;
    this.depth = depth;
  }

  protected ident() {
    return " ".repeat(this.depth * 2);
  }

  protected tab() {
    return this.depth+1;
  }

  abstract build(builder: Builder): void;
}