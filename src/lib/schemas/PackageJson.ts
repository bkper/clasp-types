export interface PackageJson {
  name: string,
  description: string,
  homepage: string,
  repository: string | { type: string, url: string }
  author: string | PackageJsonAuthor | null,
  contributors: PackageJsonAuthor[],
  license: string,
  scripts: any
  devDependencies: any
  dependencies: any
  types: string,
  keywords: string[]
}

interface PackageJsonAuthor {
  name: string,
  email: string,
  url: string
}