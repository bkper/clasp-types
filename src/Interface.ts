import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocJsonNode } from "./TypedocJsonNode";
import { Method } from "./Method";

export class Interface extends Definition {

  constructor(node: TypedocJsonNode, depth: number) {
    super(node, depth);
  }
  
  build(builder: Builder): void {
    let methods = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Function').map( node => new Method(node, this.tab()));
    builder.append(`${this.ident()}export interface ${this.node.name} {`).line()
    methods.forEach(d => d.build(builder))
    builder.append(`${this.ident()}}`).line();
  }

}