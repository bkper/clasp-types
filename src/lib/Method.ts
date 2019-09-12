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

  private buildParams(builder: Builder, signature: TypedocSignature) {
    if (signature.parameters) {
      signature.parameters.forEach((param, key, arr) => {
        this.buildParam(builder, param)
        if (!Object.is(arr.length - 1, key)) {
          //Last item
          builder.append(', ')
        }
      });
    }
  }

  private buildParam(builder: Builder, param: TypedocParameter): void {
    let sep = param.flags.isOptional ? '?:' : ':';
    builder.append(param.name).append(sep).append(' ');
    this.buildType(builder, param.type);
  }

  private buildType(builder: Builder, type?: TypedocType): void {
    if (type) {
      if (type.type === 'union' && type.types) {
        type.types.filter(t => t.name !== 'undefined' && t.name !== 'false').forEach((t, key, arr) => {
          this.buildType(builder, t)
          if (!Object.is(arr.length - 1, key)) {
            //Last item
            builder.append(' | ')
          }
        });
        return
      } else if (type.type === 'array') {
        this.buildType(builder, type.elementType);
        builder.append('[]')
        return
      }
      builder.append(type.name === 'true' ? 'boolean' : type.name);
    }

  }

}