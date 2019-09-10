import * as fs from "fs-extra";
import { Builder } from "./Builder";

let rawdata = fs.readFileSync('data/library.json');
let rootNode = JSON.parse(rawdata.toString());

let builder = new Builder(rootNode, "Bkper", "BkperApp");

fs.outputFileSync('build/google-apps-script.bkper/index.d.ts', builder.build());