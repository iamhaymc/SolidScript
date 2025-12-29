type Arr1 = [any];
type Arr2 = [any, any];
type Arr3 = [any, any, any];
type Arr4 = [any, any, any, any];
type Vec1 = [number];
type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type Mat4 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
type Box2 = [Vec2, Vec2];
type Box3 = [Vec3, Vec3];
type Line2 = [number, number, number];
type Line3 = [Vec3, Vec3];
type Plane = [number, number, number, number];
type RGB = [number, number, number];
type RGBA = [number, number, number, number];
type Color = RGB | RGBA;
type JointStyle = 'edge' | 'round' | 'chamfer';
type AlignStyle = 'center' | 'min' | 'max' | 'none';
type FileFormat2 = 'json' | 'svg';
type FileFormat3 = 'json' | 'obj';
interface Path2 {
    points: Array<Vec2>;
    isClosed: boolean;
    transforms: Mat4;
    color?: Color;
}
interface Poly2 {
    vertices: Array<Vec2>;
}
interface Poly3 {
    vertices: Array<Vec3>;
    plane?: Plane;
    color?: Color;
}
interface Geo2 {
    sides: Array<[Vec2, Vec2]>;
    transforms: Mat4;
    color?: Color;
}
interface Geo3 {
    polygons: Array<Poly3>;
    transforms: Mat4;
    color?: Color;
}
declare const ZERO2: Vec2;
declare const ZERO3: Vec3;
declare const NORM2_X: Vec2;
declare const NORM2_Y: Vec2;
declare const NORM3_X: Vec3;
declare const NORM3_Y: Vec3;
declare const NORM3_Z: Vec3;
declare const GEO_UNIT = "mm";
declare const GEO_EXTENT = 2;
declare const GEO_RADIUS = 1;
declare const GEO_QUARTER = 0.5;
declare const GEO_SEGMENTS = 32;
declare const GEO_COLOR: any;
declare const GEO_FORMAT2 = "svg";
declare const GEO_FORMAT3 = "obj";
declare function isNum(obj: any): boolean;
declare function isInt(obj: any): boolean;
declare function isStr(obj: any): obj is String;
declare function isArr(obj: any): obj is any[];
declare function isArr1(obj: any): boolean;
declare function isArr2(obj: any): boolean;
declare function isArr3(obj: any): boolean;
declare function isArr4(obj: any): boolean;
declare function isGeo2(obj: any): any;
declare function isGeo3(obj: any): any;
declare function arr3ToV(a: Arr3): any;
declare function arr3To1(a: Arr3): Arr1;
declare function arr3To2(a: Arr3): Arr2;
declare function arrVTo3(a: any, def?: any): Arr3;
declare function arr1To3(a: Arr1, def?: any): Arr3;
declare function arr2To3(a: Arr2, def?: any): Arr3;
declare function toRadians(degrees: number): number;
declare function toDegrees(radians: number): number;
/** Creates a 2D geometry builder */
declare function shape(p?: Vec2): Path2Ctx;
/** Creates cuboid 3D geometry context */
declare function cuboid(p?: Vec3, s?: Vec3, r?: number, d?: number): Geo3Ctx;
/** Creates ellipsoid 3D geometry context */
declare function ellipsoid(p?: Vec3, r?: Vec3, d?: number): Geo3Ctx;
/** Creates cylinder 3D geometry context */
declare function cylinder(p?: Vec3, r?: number | [Vec2, Vec2], h?: number, d?: number): Geo3Ctx;
/** Creates torus 3D geometry context */
declare function torus(p?: Vec3, r?: Vec2, d?: number): Geo3Ctx;
declare class Path2Ctx {
    private _path;
    constructor(_path: Path2);
    /** Extend the path with a linear spline */
    linear(ps: Array<Vec2>): Path2Ctx;
    /** Extend the path with a bezier spline */
    bezier(ps: Array<Vec2>, d?: number): Path2Ctx;
    /** Extend the path with a bezier spline */
    arc(p: Vec2, r: Vec2, cw?: boolean, lg?: boolean, d?: number): Path2Ctx;
    /** Create geometry by closing and or expansion */
    build(close: boolean, expand: boolean, offset: number, joints?: JointStyle): Geo2Ctx;
}
declare class Geo2Ctx {
    protected _geo: Geo2;
    constructor(_geo: Geo2);
    /** Transform operation */
    scale(sz: Vec2): Geo2Ctx;
    /** Transform operation */
    spin(degs: number): Geo2Ctx;
    /** Transform operation */
    move(off: Vec2): Geo2Ctx;
    /** Transform operation */
    center(pt: Vec2, axes?: [boolean, boolean]): Geo2Ctx;
    /** Transform operation */
    align(pt: Vec2, axes: [AlignStyle, AlignStyle]): Geo2Ctx;
    /** Transform operation */
    mirror(pt?: Vec2, norm?: Vec2): Geo2Ctx;
    /** Boolean operation */
    add(geoctx: Geo2Ctx): Geo2Ctx;
    /** Boolean operation */
    sub(geoctx: Geo2Ctx): Geo2Ctx;
    /** Boolean operation */
    inter(geoctx: Geo2Ctx): Geo2Ctx;
    /** Hull operation */
    hull(...geoctx: Geo2Ctx[]): Geo2Ctx;
    /** Hull operation */
    chain(...geoctx: Geo2Ctx[]): Geo2Ctx;
    /** Extrude operation (2D -> 3D) */
    extrude(sz: number, ts?: number, ta?: number): Geo3Ctx;
    /** Measure operation */
    box(): Box2;
    /** Measure operation */
    size(): Vec2;
    /** Serialize operation */
    write(format?: FileFormat2, color?: Color): string[];
}
declare class Geo3Ctx {
    protected _geo: Geo3;
    constructor(_geo: Geo3);
    /** Transform operation */
    scale(sz: Vec3): Geo3Ctx;
    /** Transform operation */
    spin(degs: Vec3): Geo3Ctx;
    /** Transform operation */
    move(off: Vec3): Geo3Ctx;
    /** Transform operation */
    center(pt: Vec3, axes?: [boolean, boolean, boolean]): Geo3Ctx;
    /** Transform operation */
    align(pt: Vec3, axes: [AlignStyle, AlignStyle, AlignStyle]): Geo3Ctx;
    /** Transform operation */
    mirror(pt?: Vec3, norm?: Vec3): Geo3Ctx;
    /** Boolean operation */
    add(geoctx: Geo3Ctx): Geo3Ctx;
    /** Boolean operation */
    sub(geoctx: Geo3Ctx): Geo3Ctx;
    /** Boolean operation */
    inter(geoctx: Geo3Ctx): Geo3Ctx;
    /** Hull operation */
    hull(...geoctx: Geo3Ctx[]): Geo3Ctx;
    /** Hull operation */
    chain(...geoctx: Geo3Ctx[]): Geo3Ctx;
    /** Extrude operation (3D -> 2D) */
    project(pt: Vec3, axes?: Vec3): Geo2Ctx;
    /** Measure operation */
    box(): Box3;
    /** Measure operation */
    size(): Vec3;
    /** Serialize operation */
    write(format?: FileFormat3, color?: Color): string[];
}

export { GEO_COLOR, GEO_EXTENT, GEO_FORMAT2, GEO_FORMAT3, GEO_QUARTER, GEO_RADIUS, GEO_SEGMENTS, GEO_UNIT, Geo2Ctx, Geo3Ctx, NORM2_X, NORM2_Y, NORM3_X, NORM3_Y, NORM3_Z, Path2Ctx, ZERO2, ZERO3, arr1To3, arr2To3, arr3To1, arr3To2, arr3ToV, arrVTo3, cuboid, cylinder, ellipsoid, isArr, isArr1, isArr2, isArr3, isArr4, isGeo2, isGeo3, isInt, isNum, isStr, shape, toDegrees, toRadians, torus };
export type { AlignStyle, Arr1, Arr2, Arr3, Arr4, Box2, Box3, Color, FileFormat2, FileFormat3, Geo2, Geo3, JointStyle, Line2, Line3, Mat4, Path2, Plane, Poly2, Poly3, RGB, RGBA, Vec1, Vec2, Vec3, Vec4 };
