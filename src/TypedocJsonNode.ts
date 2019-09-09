export interface TypedocJsonNode {

  name: string;
  comment: {tags: {tag: string}[]};
  kindString: string;
  children: TypedocJsonNode[]
  signatures: TypedocJsonNode[]

  // isEnum(): boolean {
  //   return this.hasExternalTag() && this.kindString === 'Enumeration';
  // }
  
  
  


}