import { Definition } from "./Definition";
import { Enum } from "./Enum";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Namespace } from "./Namespace";

namespace DefinitionFactory {

  export function get(node: any, depth: number): Definition {
    if (hasExternalTag(node)) {
      switch (node.kindString) {
        case "Enumeration":
          return new Enum(node.name, depth, node);
        case "Class":
          return new Interface(node.name, depth, node);
        case "Function":
          return new Method(node.name, depth, node);
        case "Module":
          return new Namespace(node.name, depth, node);
      }
    }
    return null;
  }

  function hasExternalTag(node): boolean {
    if (!node.comment) {
      return false;
    }
    if (!node.comment.tags) {
      return false;
    }
    for (let tag of node.comment.tags) {
      if (tag.tag === 'external') {
        return true;
      }
    }
    return false;
  }
}