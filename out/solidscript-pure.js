import { booleans as CadBooleans, colors as CadColors, expansions as CadExpansions, extrusions as CadExtrusions, geometries as CadGeometries, hulls as CadHulls, measurements as CadMeasurements, primitives as CadPrimitives, transforms as CadTransforms, } from "@jscad/modeling";
import * as CadSvgSer from '@jscad/svg-serializer';
import * as CadObjSer from '@jscad/obj-serializer';
import * as CadJsonSer from '@jscad/json-serializer';
export const ZERO2 = [0, 0];
export const ZERO3 = [0, 0, 0];
export const NORM2_X = [1, 0];
export const NORM2_Y = [0, 1];
export const NORM3_X = [1, 0, 0];
export const NORM3_Y = [0, 1, 0];
export const NORM3_Z = [0, 0, 0];
export const GEO_UNIT = 'mm';
export const GEO_EXTENT = 2;
export const GEO_RADIUS = 1;
export const GEO_QUARTER = 0.5;
export const GEO_SEGMENTS = 32;
export const GEO_COLOR = CadColors.hexToRgb('#938fb8');
export const GEO_FORMAT2 = 'svg';
export const GEO_FORMAT3 = 'obj';
export function isNum(obj) { return Number.isFinite(obj); }
export function isInt(obj) { return Number.isInteger(obj); }
export function isStr(obj) { return obj instanceof String; }
export function isArr(obj) { return Array.isArray(obj); }
export function isArr1(obj) { return Array.isArray(obj) && obj.length == 1; }
export function isArr2(obj) { return Array.isArray(obj) && obj.length == 2; }
export function isArr3(obj) { return Array.isArray(obj) && obj.length == 3; }
export function isArr4(obj) { return Array.isArray(obj) && obj.length == 4; }
export function isGeo2(obj) { return CadGeometries.geom2.isA(obj); }
export function isGeo3(obj) { return CadGeometries.geom3.isA(obj); }
export function arr3ToV(a) { return a[0]; }
export function arr3To1(a) { return [a[0]]; }
export function arr3To2(a) { return [a[0], a[1]]; }
export function arrVTo3(a, def = null) { return [a, def, def]; }
export function arr1To3(a, def = null) { return [a[0], def, def]; }
export function arr2To3(a, def = null) { return [a[0], a[1], def]; }
export function toRadians(degrees) { return degrees * (Math.PI / 180); }
export function toDegrees(radians) { return radians * (180 / Math.PI); }
export function shape(p) {
    return new Path2Ctx(CadGeometries.path2.create(p !== undefined ? [p] : [ZERO2]));
}
export function cuboid(p = ZERO3, s = [GEO_EXTENT, GEO_EXTENT, GEO_EXTENT], r, d) {
    let geo;
    if (r === undefined) {
        geo = CadPrimitives.roundedCuboid({
            center: p,
            size: s,
            roundRadius: r ?? GEO_RADIUS,
            segments: d ?? GEO_SEGMENTS
        });
    }
    else {
        geo = CadPrimitives.cuboid({
            center: p,
            size: s
        });
    }
    return new Geo3Ctx(geo);
}
export function ellipsoid(p = ZERO3, r = [GEO_RADIUS, GEO_RADIUS, GEO_RADIUS], d = GEO_SEGMENTS) {
    let geo = CadPrimitives.ellipsoid({
        center: p,
        radius: r,
        segments: d
    });
    return new Geo3Ctx(geo);
}
export function cylinder(p = ZERO3, r = GEO_RADIUS, h = GEO_EXTENT, d = GEO_SEGMENTS) {
    let geo;
    if (r instanceof Number) {
        geo = CadPrimitives.cylinder({
            center: p,
            height: h,
            radius: r,
            segments: d
        });
    }
    else {
        geo = CadPrimitives.cylinderElliptic({
            center: p,
            height: h,
            startRadius: r[0],
            endRadius: r[1],
            startAngle: 0,
            endAngle: Math.PI * 2,
            segments: d
        });
    }
    return new Geo3Ctx(geo);
}
export function torus(p = ZERO3, r = [GEO_QUARTER, GEO_RADIUS], d = GEO_SEGMENTS) {
    let geo = CadPrimitives.torus({
        innerRadius: r[0],
        outerRadius: r[1],
        innerSegments: d,
        outerSegments: d,
    });
    if (p[0] != 0 || p[1] != 0 || p[2] != 0)
        geo = CadTransforms.translate(p, geo);
    return new Geo3Ctx(geo);
}
export class Path2Ctx {
    constructor(_path) {
        this._path = _path;
        if (_path.points.length == 0)
            this._path = CadGeometries.path2.appendPoints([ZERO2], this._path);
    }
    linear(ps) {
        this._path = CadGeometries.path2.appendPoints(ps, this._path);
        return this;
    }
    bezier(ps, d = GEO_SEGMENTS) {
        this._path = CadGeometries.path2.appendBezier({
            controlPoints: [null, ...ps],
            segments: d,
        }, this._path);
        return this;
    }
    arc(p, r, cw = false, lg = false, d = GEO_SEGMENTS) {
        this._path = CadGeometries.path2.appendArc({
            endpoint: p, radius: r, clockwise: cw, large: lg, segments: d
        }, this._path);
        return this;
    }
    build(close = false, expand = true, offset, joints = 'edge') {
        if (close && !this._path.isClosed)
            this._path = CadGeometries.path2.close(this._path);
        let geo;
        if (expand)
            geo = CadExpansions.expand({ delta: offset, corners: joints }, this._path);
        else
            geo = CadGeometries.geom2.fromPoints(CadGeometries.path2.toPoints(this._path));
        return new Geo2Ctx(geo);
    }
}
export class Geo2Ctx {
    constructor(_geo) {
        this._geo = _geo;
    }
    scale(sz) {
        return new Geo2Ctx(CadTransforms.scale(sz, this._geo));
    }
    spin(degs) {
        return new Geo2Ctx(CadTransforms.rotate([toRadians(degs)], this._geo));
    }
    move(off) {
        return new Geo2Ctx(CadTransforms.translate(off, this._geo));
    }
    center(pt, axes = [true, true]) {
        return new Geo2Ctx(CadTransforms.center({
            relativeTo: arr2To3(pt, 0), axes: arr2To3(axes, false)
        }, this._geo));
    }
    align(pt, axes) {
        return new Geo2Ctx(CadTransforms.align({
            modes: arr2To3(axes, 'none'), relativeTo: arr2To3(pt, null), grouped: true
        }, this._geo));
    }
    mirror(pt = ZERO2, norm = NORM2_Y) {
        return new Geo2Ctx(CadTransforms.mirror({
            origin: arr2To3(pt, 0), normal: arr2To3(norm, 0)
        }, this._geo));
    }
    add(geoctx) {
        return new Geo2Ctx(CadBooleans.union(this._geo, geoctx._geo));
    }
    sub(geoctx) {
        return new Geo2Ctx(CadBooleans.subtract(this._geo, geoctx._geo));
    }
    inter(geoctx) {
        return new Geo2Ctx(CadBooleans.intersect(this._geo, geoctx._geo));
    }
    hull(...geoctx) {
        return new Geo2Ctx(CadHulls.hull(this._geo, geoctx.map(x => x._geo)));
    }
    chain(...geoctx) {
        return new Geo2Ctx(CadHulls.hullChain(this._geo, geoctx.map(x => x._geo)));
    }
    extrude(sz, ts = 0, ta = 360) {
        return new Geo3Ctx(CadExtrusions.extrudeLinear({
            height: sz, twistAngle: toRadians(ta), twistSteps: ts
        }, this._geo));
    }
    box() {
        let box = CadMeasurements.measureBoundingBox(this._geo);
        return [arr3To2(box[0]), arr3To2(box[1])];
    }
    size() {
        let dims = CadMeasurements.measureDimensions(this._geo);
        return arr3To2(dims);
    }
    write(format = GEO_FORMAT2, color = GEO_COLOR) {
        let geo = CadColors.colorize(color, this._geo);
        if (format === 'svg') {
            return CadSvgSer.serialize({ unit: GEO_UNIT }, geo);
        }
        else {
            return CadJsonSer.serialize({}, geo);
        }
    }
}
export class Geo3Ctx {
    constructor(_geo) {
        this._geo = _geo;
    }
    scale(sz) {
        return new Geo3Ctx(CadTransforms.scale(sz, this._geo));
    }
    spin(degs) {
        return new Geo3Ctx(CadTransforms.rotate([toRadians(degs[0]), toRadians(degs[1]), toRadians(degs[2])], this._geo));
    }
    move(off) {
        return new Geo3Ctx(CadTransforms.translate(off, this._geo));
    }
    center(pt, axes = [true, true, true]) {
        return new Geo3Ctx(CadTransforms.center({
            relativeTo: pt, axes: axes
        }, this._geo));
    }
    align(pt, axes) {
        return new Geo3Ctx(CadTransforms.align({
            modes: axes, relativeTo: pt, grouped: true
        }, this._geo));
    }
    mirror(pt = ZERO3, norm = NORM3_Y) {
        return new Geo3Ctx(CadTransforms.mirror({
            origin: pt, normal: norm
        }, this._geo));
    }
    add(geoctx) {
        return new Geo3Ctx(CadBooleans.union(this._geo, geoctx._geo));
    }
    sub(geoctx) {
        return new Geo3Ctx(CadBooleans.subtract(this._geo, geoctx._geo));
    }
    inter(geoctx) {
        return new Geo3Ctx(CadBooleans.intersect(this._geo, geoctx._geo));
    }
    hull(...geoctx) {
        return new Geo3Ctx(CadHulls.hull(this._geo, geoctx.map(x => x._geo)));
    }
    chain(...geoctx) {
        return new Geo3Ctx(CadHulls.hullChain(this._geo, geoctx.map(x => x._geo)));
    }
    project(pt, axes = NORM3_Z) {
        return new Geo2Ctx(CadExtrusions.project({
            origin: pt, axis: axes
        }, this._geo));
    }
    box() {
        return CadMeasurements.measureBoundingBox(this._geo);
    }
    size() {
        return CadMeasurements.measureDimensions(this._geo);
    }
    write(format = GEO_FORMAT3, color = GEO_COLOR) {
        let geo = CadColors.colorize(color, this._geo);
        if (format === 'obj') {
            return CadObjSer.serialize({ triangulate: false }, geo);
        }
        else {
            return CadJsonSer.serialize({}, geo);
        }
    }
}
