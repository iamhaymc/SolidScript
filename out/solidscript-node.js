import * as Fs from 'fs-extra';
import * as Path from 'node:path';
import * as CadSvgDeser from '@jscad/svg-deserializer';
import * as CadObjDeser from '@jscad/obj-deserializer';
import * as CadJsonDeser from '@jscad/json-deserializer';
import { Geo2Ctx, Geo3Ctx, isGeo2 } from './solidscript-pure.js';
function readText(file) {
    return Fs.readFileSync(file, 'utf-8');
}
function writeText(file, text) {
    Fs.ensureDirSync(Path.dirname(file));
    Fs.writeFileSync(file, text, 'utf-8');
    return file;
}
export function load(file) {
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
                    : data.map(x => new Geo2Ctx(x));
            }
        default: throw new Error(`Cannot load geometry from file type: ${ext}`);
    }
}
export function save(file, geo) {
    let texts = geo.write();
    if (texts.length != 1)
        throw new Error('Cannot save multiple geometries to single file');
    writeText(file, texts[0]);
    return geo;
}
