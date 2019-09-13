#!/usr/bin/env node

const program = require('commander');
import * as TypeDoc from 'typedoc';
import * as fs from "fs-extra";
import { LibraryBuilder } from "./lib/builders/LibraryBuilder";
import { GSRunBuilder } from "./lib/builders/GSRunBuilder";
import { ReadmeBuilder } from "./lib/builders/ReadmeBuilder";
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
  .option('-s, --src <folder>', 'Source folder', 'src')
  .option('-o, --out <folder>', 'Output folder', 'dts')
  .option('-g, --gsrun', 'Generate google.script.run d.ts', false)
  .parse(process.argv);

  let filename = 'index.d.ts';
  
  let claspJson: ClaspJson = JSON.parse(fs.readFileSync('.clasp.json').toString());
  let packageJson: PackageJson = JSON.parse(fs.readFileSync('package.json').toString());
  

  let srcDir: string = program.src;
  let outDir: string = program.out;
  let gsRun: boolean = program.gsrun;

  //package.json
  packageJson.name = `${packageJson.name}-dts`
  packageJson.description = `Typescript definitions for ${claspJson.library.name}`
  packageJson.scripts = {};
  packageJson.devDependencies = {};
  packageJson.types = `./${filename}`;
  fs.outputFileSync(`${outDir}/package.json`, JSON.stringify(packageJson, null, 2));  

  //README.md
  let readmeBuilder = new ReadmeBuilder(packageJson, claspJson)
  fs.outputFileSync(`${program.out}/README.md`, readmeBuilder.build().getText());

  const files = typedocApp.expandInputFiles([srcDir]);
  const project = typedocApp.convert(files);
  if (project) {

    const apiModelFilePath = `${outDir}/.clasp-dts-temp-api-model__.json`;
    
    try {

      //Generate api model
      typedocApp.generateJson(project, apiModelFilePath);

      //Generate dts
      let rawdata = fs.readFileSync(apiModelFilePath);
      let rootTypedoKind: TypedocKind = JSON.parse(rawdata.toString());

      if (gsRun) {
        let builder = new GSRunBuilder(rootTypedoKind);
        const filepath = `${outDir}/google.script.run/${filename}`;
        fs.outputFileSync(filepath, builder.build().getText());
        console.log(`Generated google.script.run d.ts at ${filepath}`);
      } else {
        //TODO validate library added to claspJson 
        let builder = new LibraryBuilder(rootTypedoKind, claspJson);
        const filepath = `${program.out}/${filename}`;
        fs.outputFileSync(filepath, builder.build().getText());
        console.log(`Generated ${claspJson.library.name} d.ts at ${program.out}`);
      }

    } finally {
      //Tear down
      fs.remove(apiModelFilePath);
    }

  } else {
    console.log('Error reading .ts source files')
  }