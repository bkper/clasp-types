import { Builder } from "./Builder";
import { TypedocJsonNode } from "./TypedocJsonNode";

export abstract class Definition {

  public node: TypedocJsonNode;
  public depth: number;

  constructor(node: TypedocJsonNode, depth: number) {
    this.node = node;
    this.depth = depth;
  }

  abstract build(builder: Builder, depth: number): void;
}