import { Definition } from "./Definition";
import { Builder } from "./builders/Builder";
import { TypedocKind } from "./schemas/TypedocJson";

export class EnumProperty extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  render(builder: Builder): void {
    this.addComment(builder, this.kind.comment);
    builder.append(`${this.ident()}${this.kind.name} = ${this.kind.defaultValue},`).doubleLine()
  }
  
}