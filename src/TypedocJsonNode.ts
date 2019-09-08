export interface TypedocJsonNode {

  name: string;
  comment: {tags: {tag: string}[]};
  kindString: string;
  children: TypedocJsonNode[]
  signatures: TypedocJsonNode[]

  // isEnum(): boolean {
  //   return this.hasExternalTag() && this.kindString === 'Enumeration';
  // }
  
  // isMethod(): boolean {
  //   return this.hasExternalTag() && this.kindString === 'Function'
  // }
  
  // isInterface(): boolean {
  //   return this.hasExternalTag() && this.kindString === 'Class';
  // }
  
  // isNamespace(): boolean {
  //   return this.hasExternalTag() && this.kindString === 'Module';
  // }

  // private hasExternalTag(): boolean {
  //   if (!this.comment) {
  //     return false;
  //   }
  //   if (!this.comment.tags) {
  //     return false;
  //   }
  //   for (let tag of this.comment.tags) {
  //     if (tag.tag === 'external') {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}