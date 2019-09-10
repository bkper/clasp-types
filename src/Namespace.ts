import { Builder } from "./Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";
import { TypedocKind } from "./TypedocSchema";

export class Namespace extends Definition {


  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
    let namespaces = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Module').map( kind => new Namespace(kind, this.tab()));
    let interfaces = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Class').map( kind => new Interface(kind, this.tab()));
    let enums = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Enumeration').map( kind => new Enum(kind, this.tab()));
    builder.append(`${this.ident()}${this.depth === 0 ? "declare " : ""}namespace ${this.kind.name} {`).doubleLine()
    interfaces.forEach(d => d.build(builder))
    namespaces.forEach(d => d.build(builder))
    builder.append(`${this.ident()}}`).doubleLine();
  }

}