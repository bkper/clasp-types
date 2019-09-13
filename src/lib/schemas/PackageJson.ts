export interface PackageJson {
  name: string,
  homepage: string,
  repository: string | { type: string, url: string }
  author: string | PackageJsonAuthor | null,
  contributors: PackageJsonAuthor[]
  scripts: any
  devDependencies: any
  types: string
}

interface PackageJsonAuthor {
  name: string,
  email: string,
  url: string
}