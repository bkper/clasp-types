import { Builder } from "./Builder";
import { TypedocKind } from "./TypedocSchema";

export abstract class Definition {

   kind: TypedocKind;
  protected depth: number;

  constructor(kind: TypedocKind, depth: number) {
    this.kind = kind;
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