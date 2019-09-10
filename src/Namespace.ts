import { Builder } from "./Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Namespace extends Definition {


  constructor(node: TypedocJsonNode, depth: number) {
    super(node, depth);
  }

  build(builder: Builder): void {
    let namespaces = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Module').map( node => new Namespace(node, this.tab()));
    let interfaces = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Class').map( node => new Interface(node, this.tab()));
    let methods = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Function').map( node => new Method(node, this.tab()));
    let enums = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Enumeration').map( node => new Enum(node, this.tab()));
    builder.append(`${this.ident()}${this.depth === 0 ? "declare " : ""}namespace ${this.node.name} {`).line()
    interfaces.forEach(d => d.build(builder))
    namespaces.forEach(d => d.build(builder))
    builder.append(`${this.ident()}}`).line();
  }

}