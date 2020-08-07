import { Builder } from "./builders/Builder";
import { TypedocKind, TypedocComment, TypedocType, TypedocSignature, TypedocParameter } from "./schemas/TypedocJson";

export abstract class Definition {

  protected kind: TypedocKind;
  protected depth: number;

  constructor(kind: TypedocKind, depth: number) {
    this.kind = kind;
    this.depth = depth;
  }

  protected ident() {
    return " ".repeat(this.depth * 4);
  }

  protected tab() {
    return this.depth + 1;
  }

  abstract render(builder: Builder): void;

  protected addComment(builder: Builder, comment: TypedocComment | undefined): void {
    if (comment && (comment.shortText || comment.text || comment.returns || comment.tags)) {
      builder.append(`${this.ident()}/**`).line()
      if (comment.shortText) {
        builder.append(`${this.ident()} * ${this.identBreaks(comment.shortText)}`).line()
        if (comment.text || comment.returns || comment.tags) {
          builder.append(`${this.ident()} *`).line()
        }
      }
      if (comment.text) {
        builder.append(`${this.ident()} * ${this.identBreaks(comment.text)}`).line()
        if (comment.returns || comment.tags) {
          builder.append(`${this.ident()} *`).line()
        }        
      }
      if (comment.returns) {
        // builder.append(`${this.ident()} *`).line()
        builder.append(`${this.ident()} * @returns ${this.identBreaks(comment.returns)}`).line()
        if (comment.tags) {
          builder.append(`${this.ident()} *`).line()
        }
      }

      if (comment.tags) {
        for (let i = 0; i < comment.tags.length; i++) {
          const tag = comment.tags[i];
          builder.append(`${this.ident()} * @${tag.tag} ${this.identBreaks(tag.text)}`).line()
          if (i+1 < comment.tags.length) {
            builder.append(`${this.ident()} *`).line()
          }
        }
      }
      builder.append(`${this.ident()} */`).line()
    }
  }

  private identBreaks(text: string|undefined): string {
    if (text == null) {
      return '';
    }
    if (text.endsWith('\n')) {
      var pos = text.lastIndexOf('\n');
      text = text.substring(0, pos);
    }
    return text.replace(new RegExp("\n", 'g'), `\n${this.ident()} * `)
  }

  protected buildType(builder: Builder, type?: TypedocType): void {
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
      } else if (type.type === 'reflection' && type.declaration) {
        if (type.declaration.signatures && type.declaration.signatures.length > 0) {
          let signature = type.declaration.signatures[0];
          builder.append('(')
          this.buildParams(builder, signature.parameters)
          builder.append(')')
          builder.append(' => ')
          this.buildType(builder, signature.type)
        } else if (type.declaration.children && type.declaration.children.length > 0) {
          builder.append('{')
          this.buildParams(builder, type.declaration.children)
          builder.append('}')
        }
        return;
      }
      if (type.name === 'true' || type.name === 'false') {
        builder.append('boolean');
      } else if (type.name) {
        builder.append(type.name);
      } else if (type.value) {
        builder.append(`"${type.value}"`);
      }
    }
  }

  protected buildParams(builder: Builder, parameters: TypedocParameter[]) {
    if (parameters) {
      parameters.forEach((param, key, arr) => {
        this.buildParam(builder, param)
        if (!Object.is(arr.length - 1, key)) {
          //Last item
          builder.append(', ')
        }
      });
    }
  }

  protected buildParam(builder: Builder, param: TypedocParameter): void {
    let sep = param.flags.isOptional ? '?:' : ':';
    let rest = param.flags.isRest ? '...' : '';
    builder.append(rest).append(param.name).append(sep).append(' ');
    this.buildType(builder, param.type);
  }

}