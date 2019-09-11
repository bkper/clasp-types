#!/usr/bin/env node

const program = require('commander');
import * as TypeDoc from 'typedoc';
import * as fs from "fs-extra";
import { Builder } from "./lib/Builder";

const typedocApp = new TypeDoc.Application({
  mode: 'file',
  logger: 'none',
  target: 'ES5',
  module: 'CommonJS',
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
  let claspdata = fs.readFileSync('.clasp.json');
  let clasp = JSON.parse(claspdata.toString());
  let rootDir = clasp.rootDir ? clasp.rootDir : '.';
  let libraryNamespace = clasp.library.namespace;
  let libraryName = clasp.library.name;
  let scriptId = clasp.scriptId;
  let libraryFolder = `google-apps-script.${libraryNamespace.toLowerCase()}`
  const files = typedocApp.expandInputFiles([rootDir]);
  const project = typedocApp.convert(files);
  if (project) {
    //Generate api model
    const apiModelFilePath = `${program.out}/${libraryFolder}.api.json`;
    typedocApp.generateJson(project, apiModelFilePath);
    console.log(`Generated api model at ${apiModelFilePath}`)
    //Generate dts
    let rawdata = fs.readFileSync(apiModelFilePath);
    let rootNode = JSON.parse(rawdata.toString());
    let builder = new Builder(rootNode, libraryNamespace, libraryName, scriptId);

    fs.outputFileSync(`build/${libraryFolder}/index.d.ts`, builder.buildLibrary());
    fs.remove(apiModelFilePath);

    console.log(`Generated ${program.gsrun ? 'google.script.run ' : ''}d.ts file to ${libraryFolder} folder`);
  } else {
    console.log('Error reading .ts source files')
  }

}

