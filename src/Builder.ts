import { Namespace } from "./Namespace";

export class Builder {
  text: string;
  rootNamespace: Namespace;
  constructor(rootNode: any) {
    this.text = '';
    this.rootNamespace = new Namespace("GoogleAppsScript", rootNode);
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