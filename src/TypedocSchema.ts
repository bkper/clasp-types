export interface TypedocKind {

  name: string
  comment?: Comment
  kindString: string
  children: TypedocKind[]
  signatures: TypedocSignature[]
  flags: {
    isPublic?: boolean
  }
}

export interface Comment {
  tags?: {
    tag: string
  }[]
}

export interface TypedocSignature {
  type: TypedocType;
  parameters: TypedocParameter[]
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