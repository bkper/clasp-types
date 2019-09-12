import { Builder } from "./builders/Builder";
import { TypedocKind, TypedocComment } from "./schemas/TypedocJson";

export abstract class Definition {

  protected kind: TypedocKind;
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

  protected addComment(builder: Builder, comment: TypedocComment | undefined): void {
    if (comment) {
      builder.append(`${this.ident()}/**`).line()
      if (comment.shortText) {
        builder.append(`${this.ident()} * ${this.identBreaks(comment.shortText)}`).line()
        builder.append(`${this.ident()} *`).line()
      }
      if (comment.text) {
        builder.append(`${this.ident()} * ${this.identBreaks(comment.text)}`).line()
      }
      if (comment.returns) {
        builder.append(`${this.ident()} * @returns ${this.identBreaks(comment.returns)}`).line()
      }
      builder.append(`${this.ident()} */`).line()
    }
  }

  private identBreaks(text: string): string {
    return text.replace(new RegExp("\n", 'g'), `\n${this.ident()} * `)
  }
}