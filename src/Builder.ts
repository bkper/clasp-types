import { Namespace } from "./Namespace";
import { TypedocKind } from "./TypedocSchema";

export class Builder {
  
  googleAppsScriptScope = "GoogleAppsScript";
  text: string;
  rootKind: TypedocKind;
  libraryNamespace: string;
  libraryName: string;

  constructor(kind: TypedocKind, libraryNamespace: string, libraryName: string) {
    this.text = '';
    this.libraryNamespace = libraryNamespace;
    this.libraryName = libraryName;
    this.rootKind = this.prepare(kind);
  }

  private prepare(kind: TypedocKind): TypedocKind {
    kind.kindString = 'Module'
    kind.flags.isPublic = true;
    kind.name = this.libraryNamespace;

    let functions = kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Function');
    let library: TypedocKind = {
      name: this.libraryName,
      kindString: 'Class',
      children: functions,
      flags: {
        isPublic: true
      },
      signatures:[]
    }
    
    let enums = kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Enumeration');
    
    enums.forEach(e => {
      let property = {
        name: e.name,
        kindString: "Property",
        flags: {
          isPublic: true,
          isTypeof: true
        },
        type: {
          type: "reference",
          name: e.name,
        },
        children: [],
        signatures: [],
      }
      library.children.unshift(property)
    });

    kind.children.unshift(library);
    return {name: this.googleAppsScriptScope, kindString: "Module", children: [kind], flags: {isPublic: true}, signatures:[]}
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
    this.append(`declare var ${this.libraryName}: ${this.googleAppsScriptScope}.${this.libraryNamespace}.${this.libraryName};`)
    return this.text;
  }


}