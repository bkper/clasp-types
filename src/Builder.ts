import { Namespace } from "./Namespace";
import { TypedocJsonNode } from "./TypedocJsonNode";

export class Builder {
  text: string;
  rootNamespace: Namespace;
  constructor(rootNode: TypedocJsonNode) {
    this.text = '';
    this.rootNamespace = new Namespace(rootNode, 0,  "GoogleAppsScript");
  }

  append(text: string):void {
    this.text += text + '\n';
  }

  build() {
    this.append('/// <reference types="google-apps-script" />')
    this.rootNamespace.build(this, 0);
    return this.text;
  }


}