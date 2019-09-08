'use strict';

import * as fs from "fs-extra";

let rawdata = fs.readFileSync('data/library.json');
let dts = JSON.parse(rawdata.toString());



fs.outputFileSync('build/google-apps-script.bkper/index.d.ts', JSON.stringify(dts.name));