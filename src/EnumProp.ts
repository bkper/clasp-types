import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocKind } from "./TypedocSchema";

export class EnumProp extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
    builder.append(`${this.ident()}${this.kind.name} = ${this.kind.defaultValue},`).doubleLine()
  }
  
}