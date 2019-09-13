import { Definition } from "./Definition";
import { Builder } from "./builders/Builder";
import { TypedocKind } from "./schemas/TypedocJson";

export class Variable extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  render(builder: Builder): void {
    this.addComment(builder, this.kind.comment);
    builder.append(`${this.ident()}`)
    if (this.kind.flags.isExported) {
      builder.append('export ')
    }
    if (this.kind.type) {
      builder.append(`var ${this.kind.name}: `);
      this.buildType(builder, this.kind.type)
      builder.append(`;`).doubleLine();
    }

  }
  
}