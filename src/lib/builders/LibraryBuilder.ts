import { Namespace } from "../Namespace";
import { TypedocKind } from "../schemas/TypedocJson";
import { PackageJson } from "../schemas/PackageJson";
import { ClaspJson } from "../schemas/ClaspJson";
import { Builder } from "./Builder";

export class LibraryBuilder extends Builder {
  
  googleAppsScriptScope = "GoogleAppsScript";
  packageJson: PackageJson;
  claspJson: ClaspJson;
  author: string | null;
  homepage: string;

  constructor(kind: TypedocKind, packageJson: PackageJson, claspJson: ClaspJson) {
    super(kind);
    this.packageJson = packageJson;
    this.claspJson = claspJson;
    this.author = this.extractAuthor(packageJson);
    this.homepage = this.extractHomepage(packageJson);
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
        shortText: `The main entry point to interact with [${this.claspJson.library.namespace}](${this.homepage})`,
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
    return {name: this.googleAppsScriptScope, kindString: "Module", children: [kind], flags: {isPublic: true}, signatures:[]}
  }

  build(): Builder {
    let rootNamespace = new Namespace(this.prepare(this.rootKind), 0);
    this.append(`// Type definitions for ${this.claspJson.library.name} ${new Date().toLocaleDateString('en-US')}`).line();
    this.append(`// Project: ${this.homepage}`).line();
    this.append(`// Generator: https://github.com/maelcaldas/clasp-dts`).line();
    this.append(`// Definitions by: ${this.author ? this.author : 'unknown developer'}`).line();
    this.append(`// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped`).doubleLine();

    this.append('/// <reference types="google-apps-script" />').doubleLine();
    rootNamespace.render(this);
    this.append(`declare var ${this.claspJson.library.name}: ${this.googleAppsScriptScope}.${this.claspJson.library.namespace}.${this.claspJson.library.name};`)
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
  
  private extractAuthor(packageJson: PackageJson): string | null {
    if (packageJson.author) {
      if (typeof packageJson.author === 'string') {
        return packageJson.author;
      } else {
        return `${packageJson.author.name ? packageJson.author.name : ''} ${packageJson.author.url ? packageJson.author.url : ''}`
      }
    }
    if (packageJson.contributors) {
      return packageJson.contributors.map(author => `${author.name ? author.name : ''} ${author.url ? author.url : ''}`).join(', ')
    }
    return null;
  }
  
  
  

}
