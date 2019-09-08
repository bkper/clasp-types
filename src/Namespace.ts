import { Builder } from "./Builder";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Enum } from "./Enum";
import { Definition } from "./Definition";

export class Namespace extends Definition {

  namespaces: Namespace[];
  interfaces: Interface[];
  methods: Method[];
  enums: Enum[];

  constructor(name: string, depth: number, node: any) {
    super(name, depth, node);
    this.namespaces = [];
    this.interfaces = [];
    this.methods = [];
    this.enums = [];
    this.parse(node)
  }

  parse(node: any): void {
    for (let child of node.children) {
      //TODO
    }
  }

  build(builder: Builder, depth: number): void {
    builder.append(`${depth === 0 ? "declare " : ""}${" ".repeat(depth * 2)}namespace ${this.name} {`)
    builder.append('}');
  }

}