import { Definition } from "./Definition";
import { Builder } from "./builders/Builder";
import { TypedocKind } from "./schemas/TypedocJson";

export class Property extends Definition {


  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
    this.addComment(builder, this.kind.comment);
    builder.append(`${this.ident()}${this.kind.name}: `)
    if (this.kind.type) {
      if (this.kind.type.type === 'reference') {
        builder.append('typeof ')
      }
      builder.append(this.kind.type.name).append(';').doubleLine();
    }
  }
  
}