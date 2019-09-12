import { Definition } from "./Definition";
import { Builder } from "./builders/Builder";
import { TypedocKind, TypedocParameter, TypedocType, TypedocSignature } from "./schemas/TypedocJson";

export class Method extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  render(builder: Builder): void {
    let signature = this.kind.signatures[0];
    this.addComment(builder, signature.comment);
    builder.append(`${this.ident()}${this.kind.name}(`);

    this.buildParams(builder, signature);
    builder.append('): ');
    this.buildType(builder, signature.type);
    builder.append(';').doubleLine()
  }
}