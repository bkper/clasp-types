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

  isPublic(node: TypedocJsonNode): boolean {
    if (!node.comment) {
      return false;
    }
    if (!node.comment.tags) {
      return false;
    }
    for (let tag of node.comment.tags) {
      if (tag.tag === 'public') {
        return true;
      }
    }
    return false;
  }

}