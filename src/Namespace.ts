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
    for (let child of this.node.children) {
      //console.log(child)
      console.log("bruna")
    }
    builder.append(`${depth === 0 ? "declare " : ""}${" ".repeat(depth * 2)}namespace ${this.name} {`)
    builder.append('}');
  }

}