import { Builder } from "./Builder";
import { TypedocKind } from "../schemas/TypedocJson";
import { Namespace } from "../Namespace";

export class GSRunBuilder extends Builder {

  rootKind: TypedocKind;

  constructor(kind: TypedocKind) {
    super();
    this.rootKind = kind;
  }

  build(): Builder {
    let rootNamespace = new Namespace(this.prepare(this.rootKind), 0);
    rootNamespace.render(this);
    return this;
  }

  /**
   * Prepare TypedocKind with functions
   */
  private prepare(kind: TypedocKind): TypedocKind {

    kind.kindString = 'Module'
    kind.flags.isPublic = true;
    kind.name = 'script';

    let functions = kind.children.filter(kind => kind.flags.isPublic).filter(kind => kind.kindString === 'Function').map(f => {
      return {
        ...f,
        signatures: [
          {
            ...f.signatures[0],
            comment: undefined,
            type: {
              type: "intrinsic",
              name: `void${f.signatures[0].type.name ? ` //${f.signatures[0].type.name}` : ''}`
            }
          }
        ],
      }
    });

    let runner: TypedocKind = {
      name: 'Runner',
      kindString: 'Class',
      children: functions,
      flags: {
        isPublic: true
      },
      signatures:[]
    }

    kind.children.unshift(runner);

    return {
      name: 'google',
      kindString: "Module",
      children: [kind],
      flags: {
        isPublic: true
      },
      signatures:[]}
  }  

}
