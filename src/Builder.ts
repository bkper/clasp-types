import { Namespace } from "./Namespace";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Builder {
  
  text: string;
  rootNode: TypedocJsonNode;
  libraryNamespace: string;
  libraryName: string;

  constructor(node: TypedocJsonNode, libraryNamespace: string, libraryName: string) {
    this.text = '';
    this.rootNode = {name: "GoogleAppsScript", kindString: "Module", children: [node]};
    this.libraryNamespace = libraryNamespace;
    this.libraryName = libraryName;
  }

  append(text: string): Builder {
    this.text += text + '\n';
    return this;
  }

  line(): Builder {
    this.text += '\n';
    return this;
  }

  build() {
    let rootNamespace = new Namespace(this.rootNode, 0);
    this.append('/// <reference types="google-apps-script" />').line();
    rootNamespace.build(this, 0);
    return this.text;
  }


}