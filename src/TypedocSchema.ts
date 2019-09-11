export interface TypedocKind {

  name: string
  comment?: TypedocComment
  kindString: string
  children: TypedocKind[]
  signatures: TypedocSignature[]
  flags: {
    isPublic?: boolean
  }
  defaultValue?: string
  type?: TypedocType
}


export interface TypedocComment {
    shortText?: string,
    text?: string,
    returns?: string
}

export interface TypedocSignature {
  type: TypedocType;
  comment: TypedocComment;
  parameters: TypedocParameter[]
}

export interface TypedocType {
  type: string
  name: string
  types?: TypedocType[]
  elementType?: TypedocType
}

export interface TypedocParameter {
  name: string
  type: TypedocType
  flags: {
    isOptional?: boolean
  }
}