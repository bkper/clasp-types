import { Builder } from "./Builder";
import { Interface } from "./Interface";

export class Namespace {

  name: string;
  children: Namespace[];
  interfaces: Interface[];

  constructor(name: string, node: any) {
    this.name = name;
    this.interfaces = [];
    this.children = [];
    this.parse(node)
  }

  parse(node: any) {
    this.interfaces.push(new Interface())
  }

  build(builder: Builder, depth: number): void {
    builder.append(`${depth === 0 ? "declare " : ""}${" ".repeat(depth * 2)}namespace ${this.name} {`)
    builder.append('}');
  }

}