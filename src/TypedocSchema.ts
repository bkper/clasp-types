export interface TypedocKind {

  name: string
  comment?: {
    tags?: {
      tag: string
    }[]
  };
  kindString: string
  children: TypedocKind[]
  signatures: {
    type: TypedocType;
    parameters: TypedocParameter[]
  }[]
  flags: {
    isPublic?: boolean
  }
}

export interface TypedocType {
  type: string
  name: string
  types: TypedocType[]
  elementType: TypedocType
}

export interface TypedocParameter {
  name: string
  type: TypedocType
  flags: {
    isOptional?: boolean
  }
}