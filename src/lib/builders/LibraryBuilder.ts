import { Namespace } from "../Namespace";
import { TypedocKind } from "../schemas/TypedocJson";
import { PackageJson } from "../schemas/PackageJson";
import { ClaspJson } from "../schemas/ClaspJson";
import { Builder } from "./Builder";

export class LibraryBuilder extends Builder {
  
  rootKind: TypedocKind;
  claspJson: ClaspJson;

  constructor(kind: TypedocKind, claspJson: ClaspJson) {
    super();
    this.rootKind = kind;
    this.claspJson = claspJson;
  }

  build(): Builder {
    let rootNamespace = new Namespace(this.prepare(this.rootKind), 0);
    this.append(`// Type definitions for ${this.claspJson.library.name} ${new Date().toLocaleDateString('en-US')}`).line();
    this.append(`// Generator: https://github.com/maelcaldas/clasp-dtsgen`).doubleLine();

    this.append('/// <reference types="google-apps-script" />').doubleLine();
    rootNamespace.render(this);
    this.append(`declare var ${this.claspJson.library.name}: ${this.claspJson.library.namespace}.${this.claspJson.library.name};`)
    return this;
  }


  private extractHomepage(packageJson: PackageJson): string {
    if (packageJson.homepage) {
      return packageJson.homepage
    }
  
    if (packageJson.repository) {
      if (typeof packageJson.repository === 'string') {
        return packageJson.repository;
      } else {
        return packageJson.repository.url.replace('\\.git', '');
      }
    }
    return 'https://developers.google.com/apps-script/guides/libraries';
  }
  
  /**
   * Prepare kind with library class from functions and enum
   */
  private prepare(kind: TypedocKind): TypedocKind {
    kind.kindString = 'Module'
    kind.flags.isPublic = true;
    kind.name = this.claspJson.library.namespace;

    let functions = kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Function');
    let library: TypedocKind = {
      name: this.claspJson.library.name,
      comment: {
        shortText: `The main entry point to interact with ${this.claspJson.library.name}`,
        text: `Script ID: **${this.claspJson.scriptId}**`
      },
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

    return kind;
  }
  
  
  

}
