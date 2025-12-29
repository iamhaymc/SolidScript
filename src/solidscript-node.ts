// JSCAD DOCUMENTATION
// - https://jscad.app/
// - https://jscad.app/docs/
// - https://openjscad.xyz/dokuwiki/doku.php

///////////////////////////////////////////////////////////////////////////////////////////////////

import * as Fs from 'fs-extra'
import * as Path from 'node:path';
import * as CadSvgDeser from '@jscad/svg-deserializer'
import * as CadObjDeser from '@jscad/obj-deserializer'
import * as CadJsonDeser from '@jscad/json-deserializer'
import { Geo2Ctx, Geo3Ctx, isGeo2 } from './solidscript-pure.js';

///////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITIES
// ------------------------------------------------------------------------------------------------

/** Reads text from a file */
function readText(file: string): string {
  return Fs.readFileSync(file, 'utf-8');
}

/** Writes text to a file */
function writeText(file: string, text: string): string {
  Fs.ensureDirSync(Path.dirname(file));
  Fs.writeFileSync(file, text, 'utf-8');
  return file;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// FILE I/O
// ------------------------------------------------------------------------------------------------

/** Reads geometry from a file */
export function load(file: string): Geo3Ctx | Geo2Ctx | Geo2Ctx[] {
  let ext = Path.extname(file).toLowerCase();
  switch (ext) {
    case '.json':
      {
        let text = readText(file);
        let data = CadJsonDeser.deserialize({ filename: file }, text);
        let geo = data[0];
        return isGeo2(geo) ? new Geo2Ctx(geo) : new Geo3Ctx(geo);
      }
    case '.obj':
      {
        let text = readText(file);
        let data = CadObjDeser.deserialize({ filename: file }, text);
        let geo = data[0];
        return new Geo3Ctx(geo);
      }
    case '.svg':
      {
        let text = readText(file);
        let data = CadSvgDeser.deserialize({ filename: file }, text);
        if (data instanceof String) 
          throw new Error(`Cannot load geometry from script content`);
        return data.length == 1 
          ? new Geo2Ctx(data[0]) 
          : (<any[]>data).map(x => new Geo2Ctx(x));
      }
    default: throw new Error(`Cannot load geometry from file type: ${ext}`);
  }
}

/** Writes geometry to a file */
export function save(file: string, geo: Geo3Ctx | Geo2Ctx): Geo3Ctx | Geo2Ctx {
  let texts = geo.write();
  if (texts.length != 1) 
    throw new Error('Cannot save multiple geometries to single file');
  writeText(file, texts[0]);
  return geo;
}

