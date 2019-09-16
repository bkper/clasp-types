#!/usr/bin/env node

const program = require('commander');
import * as TypeDoc from 'typedoc';
import * as fs from "fs-extra";
import { LibraryBuilder } from "./lib/builders/LibraryBuilder";
import { ClientSideBuilder } from "./lib/builders/ClientSideBuilder";
import { ReadmeBuilder } from "./lib/builders/ReadmeBuilder";
import { LicenseBuilder } from "./lib/builders/LicenseBuilder";
import { PackageJson } from './lib/schemas/PackageJson';
import { ClaspJson } from './lib/schemas/ClaspJson';
import { TypedocKind } from './lib/schemas/TypedocJson';

const typedocApp = new TypeDoc.Application({
  mode: 'file',
  logger: 'none',
  target: 'ES5',
  module: 'CommonJS',
  types : [],
  experimentalDecorators: true,
  ignoreCompilerErrors: true,
  excludeExternals: true
});

program
  .description("Generate d.ts for clasp projects. File [.clasp.json] required")
  .option('-s, --src <folder>', 'Source folder', 'src')
  .option('-o, --out <folder>', 'Output folder', 'types')
  .option('-r, --root <folder>', 'Root folder of [.clasp.json] and [package.json] files', '.')
  .option('-g, --client', 'Generate client side d.ts', false)
  .parse(process.argv);


let rootDir: string = program.root;
let srcDir: string = `${rootDir}/${program.src}`;
let outDir: string = `${rootDir}/${program.out}`;
let gsRun: boolean = program.client;
let filename = 'index.d.ts';


//Load .clasp.json
const claspJsonPath = `${rootDir}/.clasp.json`;
let claspJson: ClaspJson;
try {
  claspJson = JSON.parse(fs.readFileSync(claspJsonPath).toString());
} catch (error) {
  console.log(`${claspJsonPath} NOT found!`)
  process.exit(1);
}

//Load package.json
const packageJsonPath = `${rootDir}/package.json`;
let packageJson: PackageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
} catch (error) {
  console.log(`${packageJsonPath} NOT found!`)
  process.exit(1);
}

const files = typedocApp.expandInputFiles([srcDir]);
const project = typedocApp.convert(files);

if (project) {
  const apiModelFilePath = `${outDir}/.clasp-types-temp-api-model__.json`;
  try {

    //Generate api model
    typedocApp.generateJson(project, apiModelFilePath);

    //Generate types
    let rawdata = fs.readFileSync(apiModelFilePath);
    let rootTypedoKind: TypedocKind = JSON.parse(rawdata.toString());

    if (gsRun) {
      getGSRunTypes(rootTypedoKind);
    } else {
      generateLibraryTypes(rootTypedoKind);
    }

  } finally {
    //Tear down
    fs.remove(apiModelFilePath);
  }

} else {
  console.log('Error reading .ts source files')
  process.exit(1);
}



function generateLibraryTypes(rootTypedoKind: TypedocKind) {
  if (!claspJson.library || !claspJson.library.name || !claspJson.library.namespace) {
    console.log('ERROR - Add library info to .clasp.json. Example:');
    console.log();
    console.log(JSON.stringify({
      "scriptId": "xxxx",
      "rootDir": "./src",
      "library": {
        "namespace": "bkper",
        "name": "BkperApp"
      }
    }, null, 2));
    console.log();
    console.log('...or run with --client option to generate google.script.run d.ts files');
    console.log();
    return;
  }

  packageJson.name = `${packageJson.name}-types`;
  packageJson.description = `Typescript definitions for ${claspJson.library.name}`;
  packageJson.scripts = {};
  packageJson.devDependencies = {};
  packageJson.license = 'MIT';

  if (packageJson.dependencies) {
    for (let key in packageJson.dependencies) {
      packageJson.dependencies[key] = '*'
    }
  }  

  packageJson.types = `./${filename}`;
  fs.outputFileSync(`${outDir}/package.json`, JSON.stringify(packageJson, null, 2));

  //README.md
  let readmeBuilder = new ReadmeBuilder(packageJson, claspJson);
  fs.outputFileSync(`${outDir}/README.md`, readmeBuilder.build().getText());

  //LICENSE
  let licenseBuilder = new LicenseBuilder(packageJson);
  fs.outputFileSync(`${outDir}/LICENSE`, licenseBuilder.build().getText());

  //Library
  let builder = new LibraryBuilder(rootTypedoKind, claspJson, packageJson);
  const filepath = `${outDir}/${filename}`;
  fs.outputFileSync(filepath, builder.build().getText());

  console.log(`Generated ${claspJson.library.name} definitions at ${outDir}/`);
}

/**
 * Generate google.script.run d.ts file
 */
function getGSRunTypes(rootTypedoKind: TypedocKind) {
  let builder = new ClientSideBuilder(rootTypedoKind);
  const filepath = `${outDir}/google.script.types/${filename}`;
  fs.outputFileSync(filepath, builder.build().getText());
  console.log(`Generated google.script.types definitions at ${outDir}/`);
}

