#!/usr/bin/env node

const program = require('commander');
import * as TypeDoc from 'typedoc';
import * as fs from "fs-extra";
import { LibraryBuilder } from "./lib/builders/LibraryBuilder";
import { PackageJson } from './lib/schemas/PackageJson';
import { ClaspJson } from './lib/schemas/ClaspJson';
import { TypedocKind } from './lib/schemas/TypedocJson';

const typedocApp = new TypeDoc.Application({
  mode: 'file',
  logger: 'none',
  target: 'ES5',
  module: 'CommonJS',
  exclude: 'node_modules',
  experimentalDecorators: true,
  ignoreCompilerErrors: true,
  excludeExternals: true
});

program
  .description("Generate d.ts file for Google Apps Script ts files")
  .option('-o, --out <folder>', 'Output folder', './')
  .option('-g, --gsrun', 'Generate google.script.run d.ts')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {

  //package.json
  let packageJsonData = fs.readFileSync('package.json');
  let packageJson: PackageJson = JSON.parse(packageJsonData.toString());

  //clasp
  let claspdata = fs.readFileSync('.clasp.json');
  let claspJson: ClaspJson = JSON.parse(claspdata.toString());

  let rootDir = claspJson.rootDir ? claspJson.rootDir : '.';

  let libraryFolder = `google-apps-script.${claspJson.library.namespace.toLowerCase()}`

  const files = typedocApp.expandInputFiles([rootDir]);
  const project = typedocApp.convert(files);
  if (project) {
    //Generate api model
    const apiModelFilePath = `${program.out}/${libraryFolder}.api.json`;
    typedocApp.generateJson(project, apiModelFilePath);
    console.log(`Generated api model at ${apiModelFilePath}`)
    //Generate dts
    let rawdata = fs.readFileSync(apiModelFilePath);
    let rootTypedoKind: TypedocKind = JSON.parse(rawdata.toString());
    let builder = new LibraryBuilder(rootTypedoKind, packageJson, claspJson);

    fs.outputFileSync(`build/${libraryFolder}/index.d.ts`, builder.build());
    fs.remove(apiModelFilePath);

    console.log(`Generated ${program.gsrun ? 'google.script.run ' : ''}d.ts file to ${libraryFolder} folder`);
  } else {
    console.log('Error reading .ts source files')
  }
}