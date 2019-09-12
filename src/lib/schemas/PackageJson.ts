export interface PackageJson {
  homepage: string,
  repository: string | { type: string, url: string }
  author: string | PackageJsonAuthor | null,
  contributors: PackageJsonAuthor[]
}

interface PackageJsonAuthor {
  name: string,
  email: string,
  url: string
}