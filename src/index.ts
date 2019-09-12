#!/usr/bin/env node

const program = require('commander');
import * as TypeDoc from 'typedoc';
import * as fs from "fs-extra";
import { LibraryBuilder } from "./lib/builders/LibraryBuilder";
import { GSRunBuilder } from "./lib/builders/GSRunBuilder";
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
  .option('-s, --src <folder>', 'Source folder', './', 'src')
  .option('-o, --out <folder>', 'Output folder', './', 'dist')
  .option('-g, --gsrun', 'Generate google.script.run d.ts', false)
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

  let srcDir:string = program.src;
  let outDir:string = program.out;
  let gsRun: boolean = program.gsrun;

  const files = typedocApp.expandInputFiles([srcDir]);
  const project = typedocApp.convert(files);
  if (project) {
    //Generate api model
    const apiModelFilePath = `${outDir}/.clasp-dts-temp-api-model__.json`;
    typedocApp.generateJson(project, apiModelFilePath);
    console.log(`Generated api model at ${apiModelFilePath}`)

    //Generate dts
    let rawdata = fs.readFileSync(apiModelFilePath);
    let rootTypedoKind: TypedocKind = JSON.parse(rawdata.toString());

    if (gsRun) {
      let builder = new GSRunBuilder(rootTypedoKind);
      const filename = `${outDir}/google.script.run/index2.d.ts`;
      fs.outputFileSync(filename, builder.build().getText());
      console.log(`Generated ${filename}`);
    } else {

      //TODO validate library added to claspJson 
      let libraryFolder = `google-apps-script.${claspJson.library.namespace.toLowerCase()}`
      let builder = new LibraryBuilder(rootTypedoKind, packageJson, claspJson);
      const filename = `${program.out}/${libraryFolder}/index.d.ts`;
      fs.outputFileSync(filename, builder.build().getText());
      console.log(`Generated ${filename}`);
    }

    //Tear down
    //fs.remove(apiModelFilePath);

  } else {
    console.log('Error reading .ts source files')
  }
}