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

  willGen(node: TypedocJsonNode): boolean {
    if (!node.comment) {
      return true;
    }
    if (!node.comment.tags) {
      return true;
    }
    for (let tag of node.comment.tags) {
      if (tag.tag === 'ignore' || tag.tag === 'hidden') {
        return false;
      }
    }
    return true;
  }

}