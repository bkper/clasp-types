import { Builder } from "./Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Namespace extends Definition {

  name: string;
  namespaces: Namespace[];
  interfaces: Interface[];
  methods: Method[];
  enums: Enum[];

  constructor(node: TypedocJsonNode, depth: number, name: string) {
    super(node, depth);
    this.name = name;
    this.namespaces = [];
    this.interfaces = [];
    this.methods = [];
    this.enums = [];
  }



  build(builder: Builder, depth: number): void {
    this.namespaces = this.node.children.filter(super.willGen).filter(node => node.kindString === 'Module').map( node => new Namespace(node, depth, node.name));
    this.interfaces = this.node.children.filter(super.willGen).filter(node => node.kindString === 'Class').map( node => new Interface(node, depth));
    this.methods = this.node.children.filter(super.willGen).filter(node => node.kindString === 'Function').map( node => new Method(node, depth));
    this.enums = this.node.children.filter(super.willGen).filter(node => node.kindString === 'Enumeration').map( node => new Enum(node, depth));

    builder.append(`${depth === 0 ? "declare " : ""}${" ".repeat(depth * 2)}namespace ${this.name} {`)
    this.methods.forEach(method => builder.append(method.node.name))
    builder.append('}');
  }

}