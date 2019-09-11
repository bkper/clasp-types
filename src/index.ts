import * as fs from "fs-extra";
import { Builder } from "./Builder";

let rawdata = fs.readFileSync('data/library.json');
let claspdata = fs.readFileSync('.clasp.json');

let rootNode = JSON.parse(rawdata.toString());
let clasp = JSON.parse(claspdata.toString());

let libraryNamespace = clasp.library.namespace;
let libraryName = clasp.library.name;
let scriptId = clasp.scriptId;

let builder = new Builder(rootNode, libraryNamespace, libraryName, scriptId);

fs.outputFileSync(`build/google-apps-script.${libraryNamespace.toLowerCase()}/index.d.ts`, builder.buildLibrary());