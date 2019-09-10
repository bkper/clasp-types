import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocKind } from "./TypedocSchema";

export class Enum extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
  }
  
}