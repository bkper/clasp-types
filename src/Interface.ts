import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocKind } from "./TypedocSchema";
import { Method } from "./Method";

export class Interface extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }
  
  build(builder: Builder): void {
    let methods = this.kind.children.filter(k => this.kind.kindString === 'Interface' ? true : k.flags.isPublic).filter(k => k.kindString === 'Method').map(k => new Method(k, this.tab()));
    if (methods.length > 0) {
      builder.append(`${this.ident()}export interface ${this.kind.name} {`).doubleLine()
      methods.forEach(d => d.build(builder))
      builder.append(`${this.ident()}}`).doubleLine();
    }
  }

}