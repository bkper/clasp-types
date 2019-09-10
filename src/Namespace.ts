import { Builder } from "./Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Namespace extends Definition {

  namespaces: Namespace[];
  interfaces: Interface[];
  methods: Method[];
  enums: Enum[];

  constructor(node: TypedocJsonNode, depth: number) {
    super(node, depth);
    this.namespaces = [];
    this.interfaces = [];
    this.methods = [];
    this.enums = [];
  }

  build(builder: Builder, depth: number): void {
    this.node.children.forEach(child => console.log(child.name))
    this.namespaces = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Module').map( node => new Namespace(node, depth));
    this.interfaces = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Class').map( node => new Interface(node, depth));
    this.methods = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Function').map( node => new Method(node, depth));
    this.enums = this.node.children.filter(node => node.flags.isPublic).filter(node => node.kindString === 'Enumeration').map( node => new Enum(node, depth));
    let ident = " ".repeat(depth * 2)
    builder.append(`${ident}${depth === 0 ? "declare " : ""}namespace ${this.node.name} {`).line()
    this.interfaces.forEach(d => d.build(builder, depth+1))
    this.namespaces.forEach(d => d.build(builder, depth+1))
    builder.append(`${ident}}`).line();
  }

}