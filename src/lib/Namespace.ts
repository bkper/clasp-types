import { Builder } from "./builders/Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";
import { TypedocKind } from "./schemas/TypedocJson";

export class Namespace extends Definition {


  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  render(builder: Builder): void {
    let namespaces = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Module').map( kind => new Namespace(kind, this.tab()));
    let interfaces = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Class' || kind.kindString === 'Interface').map(kind => new Interface(kind, this.tab()));
    let enums = this.kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Enumeration').map( kind => new Enum(kind, this.tab()));
    builder.append(`${this.ident()}${this.depth === 0 ? "declare " : ""}namespace ${this.kind.name} {`).doubleLine()
    namespaces.forEach(n => n.render(builder))
    interfaces.forEach(i => i.render(builder))
    enums.forEach(e => e.render(builder))
    builder.append(`${this.ident()}}`).doubleLine();
  }

}