export interface TypedocKind {
  name: string
  comment?: TypedocComment
  kindString: string
  children: TypedocKind[]
  signatures: TypedocSignature[]
  flags: {
    isPublic?: boolean
    isExported?: boolean
    isOptional?: boolean
    //custom ;-)
    isTypeof?: boolean
  }
  defaultValue?: string
  type?: TypedocType
}


export interface TypedocComment {
    shortText?: string,
    text?: string,
    returns?: string,
    tags?: TypedocTag[]
}

export interface TypedocTag {
  tag: string,
  text?: string
}

export interface TypedocSignature {
  type: TypedocType;
  comment?: TypedocComment;
  parameters: TypedocParameter[]
}

export interface TypedocType {
  type: string
  value?: string
  name: string
  declaration?: TypedocDeclaration
  types?: TypedocType[]
  elementType?: TypedocType
}

export interface TypedocParameter {
  name: string
  type: TypedocType
  flags: {
    isOptional?: boolean
    isRest?: boolean
  }
}

export interface TypedocDeclaration {
  signatures: TypedocSignature[];
  children: TypedocParameter[];
  indexSignature: TypedocSignature[];
}