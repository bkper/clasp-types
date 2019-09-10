import { Namespace } from "./Namespace";
import { TypedocKind } from "./TypedocSchema";

export class Builder {
  
  text: string;
  rootKind: TypedocKind;
  libraryNamespace: string;
  libraryName: string;

  constructor(kind: TypedocKind, libraryNamespace: string, libraryName: string) {
    this.text = '';
    this.rootKind = this.prepare(kind);
    this.libraryNamespace = libraryNamespace;
    this.libraryName = libraryName;
  }

  private prepare(kind: TypedocKind): TypedocKind {
    kind.kindString = 'Module'
    kind.flags.isPublic = true;
    return {name: "GoogleAppsScript", kindString: "Module", children: [kind], flags: {isPublic: true}, signatures:[]}
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

  buildLibrary() {
    let rootNamespace = new Namespace(this.rootKind, 0);
    this.append('/// <reference types="google-apps-script" />').doubleLine();
    rootNamespace.build(this);
    return this.text;
  }


}