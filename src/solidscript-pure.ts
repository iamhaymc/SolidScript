// JSCAD DOCUMENTATION
// - https://jscad.app/
// - https://jscad.app/docs/
// - https://openjscad.xyz/dokuwiki/doku.php

///////////////////////////////////////////////////////////////////////////////////////////////////

import {
  booleans as CadBooleans,
  colors as CadColors,
  expansions as CadExpansions,
  extrusions as CadExtrusions,
  geometries as CadGeometries,
  hulls as CadHulls,
  measurements as CadMeasurements,
  primitives as CadPrimitives,
  transforms as CadTransforms,
} from "@jscad/modeling";
import * as CadSvgSer from '@jscad/svg-serializer'
import * as CadObjSer from '@jscad/obj-serializer'
import * as CadJsonSer from '@jscad/json-serializer'

///////////////////////////////////////////////////////////////////////////////////////////////////
// TYPES
// ------------------------------------------------------------------------------------------------

export type Arr1 = [any]
export type Arr2 = [any, any]
export type Arr3 = [any, any, any]
export type Arr4 = [any, any, any, any]
export type Vec1 = [number]
export type Vec2 = [number, number]
export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]
export type Mat4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
]
export type Box2 = [Vec2, Vec2]
export type Box3 = [Vec3, Vec3]
export type Line2 = [number, number, number]
export type Line3 = [Vec3, Vec3]
export type Plane = [number, number, number, number]
export type RGB = [number, number, number]
export type RGBA = [number, number, number, number]
export type Color = RGB | RGBA
export type JointStyle = 'edge' | 'round' | 'chamfer'
export type AlignStyle = 'center' | 'min' | 'max' | 'none'
export type FileFormat2 = 'json' | 'svg'
export type FileFormat3 = 'json' | 'obj'

export interface Path2 {
  points: Array<Vec2>
  isClosed: boolean
  transforms: Mat4
  color?: Color
}
export interface Poly2 {
  vertices: Array<Vec2>
}
export interface Poly3 {
  vertices: Array<Vec3>
  plane?: Plane
  color?: Color
}
export interface Geo2 {
  sides: Array<[Vec2, Vec2]>
  transforms: Mat4,
  color?: Color
}
export interface Geo3 {
  polygons: Array<Poly3>
  transforms: Mat4
  color?: Color
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITIES
// ------------------------------------------------------------------------------------------------

export const ZERO2: Vec2 = [0, 0];
export const ZERO3: Vec3 = [0, 0, 0];
export const NORM2_X: Vec2 = [1, 0];
export const NORM2_Y: Vec2 = [0, 1];
export const NORM3_X: Vec3 = [1, 0, 0];
export const NORM3_Y: Vec3 = [0, 1, 0];
export const NORM3_Z: Vec3 = [0, 0, 0];
export const GEO_UNIT = 'mm'
export const GEO_EXTENT = 2
export const GEO_RADIUS = 1
export const GEO_QUARTER = 0.5
export const GEO_SEGMENTS = 32
export const GEO_COLOR = CadColors.hexToRgb('#938fb8');
export const GEO_FORMAT2 = 'svg'
export const GEO_FORMAT3 = 'obj'

export function isNum(obj: any) { return Number.isFinite(obj); }
export function isInt(obj: any) { return Number.isInteger(obj); }
export function isStr(obj: any) { return obj instanceof String; }
export function isArr(obj: any) { return Array.isArray(obj) }
export function isArr1(obj: any) { return Array.isArray(obj) && (<any[]>obj).length == 1; }
export function isArr2(obj: any) { return Array.isArray(obj) && (<any[]>obj).length == 2; }
export function isArr3(obj: any) { return Array.isArray(obj) && (<any[]>obj).length == 3; }
export function isArr4(obj: any) { return Array.isArray(obj) && (<any[]>obj).length == 4; }
export function isGeo2(obj: any) { return CadGeometries.geom2.isA(obj); }
export function isGeo3(obj: any) { return CadGeometries.geom3.isA(obj); }
export function arr3ToV(a: Arr3): any { return a[0]; }
export function arr3To1(a: Arr3): Arr1 { return [a[0]]; }
export function arr3To2(a: Arr3): Arr2 { return [a[0], a[1]]; }
export function arrVTo3(a: any, def: any = null): Arr3 { return [a, def, def]; }
export function arr1To3(a: Arr1, def: any = null): Arr3 { return [a[0], def, def]; }
export function arr2To3(a: Arr2, def: any = null): Arr3 { return [a[0], a[1], def]; }
export function toRadians(degrees: number) { return degrees * (Math.PI / 180); }
export function toDegrees(radians: number) { return radians * (180 / Math.PI) }

///////////////////////////////////////////////////////////////////////////////////////////////////
// BUILDERS
// ------------------------------------------------------------------------------------------------

/** Creates a 2D geometry builder */
export function shape(p?: Vec2): Path2Ctx {
  return new Path2Ctx(
    CadGeometries.path2.create(p !== undefined ? [p] : [ZERO2]));
}
/** Creates cuboid 3D geometry context */
export function cuboid(
  p: Vec3 = ZERO3,
  s: Vec3 = [GEO_EXTENT, GEO_EXTENT, GEO_EXTENT],
  r?: number,
  d?: number
): Geo3Ctx {
  // https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_cuboid
  let geo: Geo3;
  if (r === undefined) {
    geo = CadPrimitives.roundedCuboid({
      center: p,
      size: s,
      roundRadius: r ?? GEO_RADIUS,
      segments: d ?? GEO_SEGMENTS
    });
  } else {
    geo = CadPrimitives.cuboid({
      center: p,
      size: s
    });
  }
  return new Geo3Ctx(geo);
}
/** Creates ellipsoid 3D geometry context */
export function ellipsoid(
  p: Vec3 = ZERO3,
  r: Vec3 = [GEO_RADIUS, GEO_RADIUS, GEO_RADIUS],
  d: number = GEO_SEGMENTS
): Geo3Ctx {
  // https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_spheroid
  let geo = CadPrimitives.ellipsoid({
    center: p,
    radius: r,
    segments: d
  });
  return new Geo3Ctx(geo);
}
/** Creates cylinder 3D geometry context */
export function cylinder(
  p: Vec3 = ZERO3,
  r: number | [Vec2, Vec2] = GEO_RADIUS,
  h: number = GEO_EXTENT,
  d: number = GEO_SEGMENTS
): Geo3Ctx {
  // https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_cylinder
  let geo: Geo3;
  if (r instanceof Number) {
    geo = CadPrimitives.cylinder({
      center: p,
      height: h,
      radius: <number>r,
      segments: d
    });
  } else {
    geo = CadPrimitives.cylinderElliptic({
      center: p,
      height: h,
      startRadius: (<[Vec2, Vec2]>r)[0],
      endRadius: (<[Vec2, Vec2]>r)[1],
      startAngle: 0,
      endAngle: Math.PI * 2,
      segments: d
    });
  }
  return new Geo3Ctx(geo);
}
/** Creates torus 3D geometry context */
export function torus(
  p: Vec3 = ZERO3,
  r: Vec2 = [GEO_QUARTER, GEO_RADIUS],
  d: number = GEO_SEGMENTS
): Geo3Ctx {
  // https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_torus
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
  // https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_path
  constructor(private _path: Path2) {
    // Ensure start point
    if (_path.points.length == 0)
      this._path = CadGeometries.path2.appendPoints([ZERO2], this._path);
  }
  /** Extend the path with a linear spline */
  public linear(
    ps: Array<Vec2>
  ): Path2Ctx {
    this._path = CadGeometries.path2.appendPoints(ps, this._path);
    return this;
  }
  /** Extend the path with a bezier spline */
  public bezier(
    ps: Array<Vec2>, d: number = GEO_SEGMENTS)
    : Path2Ctx {
    this._path = CadGeometries.path2.appendBezier({
      controlPoints: [null, ...ps], // The first control point may be 'null'
      segments: d,                  // to ensure a smooth transition occurs between curves
    }, this._path);
    return this;
  }
  /** Extend the path with a bezier spline */
  public arc(
    p: Vec2, r: Vec2, cw: boolean = false, lg: boolean = false, d: number = GEO_SEGMENTS
  ): Path2Ctx {
    this._path = CadGeometries.path2.appendArc({
      endpoint: p, radius: r, clockwise: cw, large: lg, segments: d
    }, this._path);
    return this;
  }
  /** Create geometry by closing and or expansion */
  public build(
    close: boolean = false, expand: boolean = true, offset: number, joints: JointStyle = 'edge'
  ): Geo2Ctx {
    if (close && !this._path.isClosed)
      this._path = CadGeometries.path2.close(this._path);
    let geo: Geo2;
    if (expand) 
      geo = CadExpansions.expand({ delta: offset, corners: joints }, this._path)
    else 
      geo = CadGeometries.geom2.fromPoints(CadGeometries.path2.toPoints(this._path));
    return new Geo2Ctx(geo);
  }
}

export class Geo2Ctx {
  constructor(protected _geo: Geo2) { }

  /** Transform operation */
  public scale(sz: Vec2): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.scale(sz, this._geo));
  }
  /** Transform operation */
  public spin(degs: number): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.rotate([toRadians(degs)], this._geo));
  }
  /** Transform operation */
  public move(off: Vec2): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.translate(off, this._geo));
  }
  /** Transform operation */
  public center(pt: Vec2, axes: [boolean, boolean] = [true, true]): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.center({
      relativeTo: arr2To3(pt, 0), axes: arr2To3(axes, false)
    }, this._geo));
  }
  /** Transform operation */
  public align(pt: Vec2, axes: [AlignStyle, AlignStyle]): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.align({
      modes: arr2To3(axes, 'none'), relativeTo: arr2To3(pt, null), grouped: true
    }, this._geo));
  }
  /** Transform operation */
  public mirror(pt: Vec2 = ZERO2, norm: Vec2 = NORM2_Y): Geo2Ctx {
    return new Geo2Ctx(CadTransforms.mirror({
      origin: arr2To3(pt, 0), normal: arr2To3(norm, 0)
    }, this._geo));
  }
  /** Boolean operation */
  public add(geoctx: Geo2Ctx): Geo2Ctx {
    return new Geo2Ctx(CadBooleans.union(this._geo, geoctx._geo));
  }
  /** Boolean operation */
  public sub(geoctx: Geo2Ctx): Geo2Ctx {
    return new Geo2Ctx(CadBooleans.subtract(this._geo, geoctx._geo));
  }
  /** Boolean operation */
  public inter(geoctx: Geo2Ctx): Geo2Ctx {
    return new Geo2Ctx(CadBooleans.intersect(this._geo, geoctx._geo));
  }
  /** Hull operation */
  public hull(...geoctx: Geo2Ctx[]): Geo2Ctx {
    return new Geo2Ctx(CadHulls.hull(this._geo, geoctx.map(x => x._geo)));
  }
  /** Hull operation */
  public chain(...geoctx: Geo2Ctx[]): Geo2Ctx {
    return new Geo2Ctx(CadHulls.hullChain(this._geo, geoctx.map(x => x._geo)));
  }
  /** Extrude operation (2D -> 3D) */
  public extrude(sz: number, ts: number = 0, ta: number = 360): Geo3Ctx {
    return new Geo3Ctx(CadExtrusions.extrudeLinear({
      height: sz, twistAngle: toRadians(ta), twistSteps: ts
    }, this._geo));
  }
  /** Measure operation */
  public box(): Box2 {
    let box = CadMeasurements.measureBoundingBox(this._geo);
    return [arr3To2(box[0]), arr3To2(box[1])];
  }
  /** Measure operation */
  public size(): Vec2 {
    let dims = CadMeasurements.measureDimensions(this._geo);
    return arr3To2(dims);
  }
  /** Serialize operation */
  public write(format: FileFormat2 = GEO_FORMAT2, color: Color = GEO_COLOR): string[] {
    let geo = CadColors.colorize(color, this._geo);
    if (format === 'svg') {
      // https://github.com/jscad/OpenJSCAD.org/tree/master/packages/io/svg-serializer
      return CadSvgSer.serialize({ unit: GEO_UNIT }, geo);
    } else {
      // https://github.com/jscad/OpenJSCAD.org/tree/master/packages/io/json-serializer
      return CadJsonSer.serialize({}, geo);
    }
  }
}

export class Geo3Ctx {
  constructor(protected _geo: Geo3) { }

  /** Transform operation */
  public scale(sz: Vec3): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.scale(sz, this._geo));
  }
  /** Transform operation */
  public spin(degs: Vec3): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.rotate(
      [toRadians(degs[0]), toRadians(degs[1]), toRadians(degs[2])], this._geo));
  }
  /** Transform operation */
  public move(off: Vec3): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.translate(off, this._geo));
  }
  /** Transform operation */
  public center(pt: Vec3, axes: [boolean, boolean, boolean] = [true, true, true]): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.center({
      relativeTo: pt, axes: axes
    }, this._geo));
  }
  /** Transform operation */
  public align(pt: Vec3, axes: [AlignStyle, AlignStyle, AlignStyle]): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.align({
      modes: axes, relativeTo: pt, grouped: true
    }, this._geo));
  }
  /** Transform operation */
  public mirror(pt: Vec3 = ZERO3, norm: Vec3 = NORM3_Y): Geo3Ctx {
    return new Geo3Ctx(CadTransforms.mirror({
      origin: pt, normal: norm
    }, this._geo));
  }
  /** Boolean operation */
  public add(geoctx: Geo3Ctx): Geo3Ctx {
    return new Geo3Ctx(CadBooleans.union(this._geo, geoctx._geo));
  }
  /** Boolean operation */
  public sub(geoctx: Geo3Ctx): Geo3Ctx {
    return new Geo3Ctx(CadBooleans.subtract(this._geo, geoctx._geo));
  }
  /** Boolean operation */
  public inter(geoctx: Geo3Ctx): Geo3Ctx {
    return new Geo3Ctx(CadBooleans.intersect(this._geo, geoctx._geo));
  }
  /** Hull operation */
  public hull(...geoctx: Geo3Ctx[]): Geo3Ctx {
    return new Geo3Ctx(CadHulls.hull(this._geo, geoctx.map(x => x._geo)));
  }
  /** Hull operation */
  public chain(...geoctx: Geo3Ctx[]): Geo3Ctx {
    return new Geo3Ctx(CadHulls.hullChain(this._geo, geoctx.map(x => x._geo)));
  }
  /** Extrude operation (3D -> 2D) */
  public project(pt: Vec3, axes: Vec3 = NORM3_Z): Geo2Ctx {
    return new Geo2Ctx(CadExtrusions.project({
      origin: pt, axis: axes
    }, this._geo));
  }
  /** Measure operation */
  public box(): Box3 {
    return CadMeasurements.measureBoundingBox(this._geo);
  }
  /** Measure operation */
  public size(): Vec3 {
    return CadMeasurements.measureDimensions(this._geo);
  }
  /** Serialize operation */
  public write(format: FileFormat3 = GEO_FORMAT3, color: Color = GEO_COLOR): string[] {
    let geo = CadColors.colorize(color, this._geo);
    if (format === 'obj') {
      // https://github.com/jscad/OpenJSCAD.org/tree/master/packages/io/obj-serializer
      return CadObjSer.serialize({ triangulate: false }, geo)
    } else {
      // https://github.com/jscad/OpenJSCAD.org/tree/master/packages/io/json-serializer
      return CadJsonSer.serialize({}, geo);
    }
  }
}