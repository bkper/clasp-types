import * as fs from "fs-extra";
import { Builder } from "./Builder";

let rawdata = fs.readFileSync('data/library.json');
let claspdata = fs.readFileSync('.clasp.json');

let rootNode = JSON.parse(rawdata.toString());
let clasp = JSON.parse(claspdata.toString());

let libraryNamespace: string = clasp.library.namespace;
let libraryName: string = clasp.library.name;

let builder = new Builder(rootNode, libraryNamespace, libraryName);

fs.outputFileSync(`build/google-apps-script.${libraryNamespace.toLowerCase()}/index.d.ts`, builder.buildLibrary());