export interface TypedocJsonNode {

  name: string;
  comment?: {tags?: {tag: string}[]};
  kindString: string;
  children: TypedocJsonNode[];
  signatures?: TypedocJsonNode[];
  flags: {isPublic?: boolean};

}