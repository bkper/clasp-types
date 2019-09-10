import { Definition } from "./Definition";
import { Builder } from "./Builder";
import { TypedocKind, TypedocParameter, TypedocType } from "./TypedocSchema";

export class Method extends Definition {

  constructor(kind: TypedocKind, depth: number) {
    super(kind, depth);
  }

  build(builder: Builder): void {
    console.log(this.kind.name)
    let signature = this.kind.signatures[0];
    builder.append(`${this.ident()}${this.kind.name}(`)
    if (signature.parameters) {
      signature.parameters.forEach(param => {
        builder.append(`${this.buildParam(param)}, `)
      });
    }
    builder.append(')').line();
  }

  buildParam(param: TypedocParameter): string {
    let sep = param.flags.isOptional ? '?:' : ':';
    return  `${param.name}${sep} ${this.buildType(param.type)}`
  }

  buildType(type: TypedocType): string {
    if (type.type === 'union') {
      for(type of type.types) {
        return `${this.buildType(type)} | `
      }
    } else if (type.type ==='array') {
      return `${this.buildType(type.elementType)}[]`
    } else if (type.name != 'undefined'){
      return type.name;
    }
    return 'boolean';
  }

}