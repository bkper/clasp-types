import { Namespace } from "../Namespace";
import { TypedocKind } from "../schemas/TypedocJson";
import { PackageJson } from "../schemas/PackageJson";
import { ClaspJson } from "../schemas/ClaspJson";

export abstract class Builder {
  
  text = '';
  rootKind: TypedocKind;

  constructor(kind: TypedocKind) {
    this.rootKind = kind;
  }

  append(text: string): Builder {
    this.text += text;
    return this;
  }

  doubleLine(): Builder {
    this.text += '\n\n';
    return this;
  }

  line(): Builder {
    this.text += '\n';
    return this;
  }

  abstract build(): string;

}