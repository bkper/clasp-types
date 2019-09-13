import { PackageJson } from "../schemas/PackageJson";
import { Builder } from "./Builder";
import { ClaspJson } from "../schemas/ClaspJson";

export class LicenseBuilder extends Builder {

  packageJson: PackageJson;

  constructor(packageJson: PackageJson) {
    super()
    this.packageJson = packageJson;
  }

  public build(): Builder {
    let date = new Date().toLocaleDateString("en-US", {year: 'numeric'})
    this
    .append(`
MIT License

Copyright (c) ${date} ${this.extractAuthor()}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
    `).doubleLine()
    return this;
  }

  private extractAuthor(): string {
    if (this.packageJson.author) {
      if (typeof this.packageJson.author === 'string') {
        return this.packageJson.author;
      } else {
        return `${this.packageJson.author.name ? this.packageJson.author.name : ''} ${this.packageJson.author.email ? this.packageJson.author.email : ''}`
      }
    }
    return '';
  }

}