import { Definition } from "./Definition";
import { EnumProp } from "./EnumProp";
import { Builder } from "./Builder";
import { TypedocKind } from "./TypedocSchema";

export class Enum extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
    let props = this.kind.children.map(k => new EnumProp(k, this.tab()));
    builder.append(`${this.ident()}export enum ${this.kind.name} {`).doubleLine()
    props.forEach(p => p.build(builder))
    builder.append(`${this.ident()}}`).doubleLine();
  }
  
}