import { dts } from "rollup-plugin-dts";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfill from 'rollup-plugin-polyfill-node'
import prettier from 'rollup-plugin-prettier';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

// ----------------------------------------------------------------------------

export default [
  {
    input: './src/solidscript-pure.ts',
    output: [
      // OUTPUT ->  ESM / UNFORMATTED / UNMINIFIED
      {
        file: './out/solidscript.esm.js',
        format: 'es',
        plugins: [
          //createTerserPlugin(),
          //createPrettierPlugin()
        ]
      },
      // OUTPUT ->  ESM / FORMATTED   / MINIFIED
      {
        file: './out/solidscript.esm.min.js',
        format: 'es',
        plugins: [
          createTerserPlugin(),
          createPrettierPlugin()
        ]
      },
      // OUTPUT ->  UMD / FORMATTED   / UNMINIFIED
      {
        file: './out/solidscript.umd.js',
        format: 'umd',
        name: 'SOLIDS',
        plugins: [
          //createTerserPlugin(),
          createPrettierPlugin()
        ]
      },
      // OUTPUT ->  UMD / UNFORMATTED / MINIFIED
      {
        file: './out/solidscript.umd.min.js',
        format: 'umd',
        name: 'SOLIDS',
        plugins: [
          createTerserPlugin(),
          //createPrettierPlugin()
        ]
      },
    ],
    plugins: [
      ...createCommonPlugins(),
      createTypescriptPlugin()
    ]
  },
  // OUTPUT -> TYPINGS
  {
    input: './src/solidscript-pure.ts',
    output: {
      file: './out/solidscript.d.ts',
      format: 'es',
    },
    plugins: [
      dts({ tsconfig: false }),
    ]
  }
];

// ----------------------------------------------------------------------------

function createCommonPlugins() {
  return [
    json(),
    commonjs(),
    nodeResolve(),
    nodePolyfill(),
  ]
}
function createTypescriptPlugin() {
  return typescript({
    tsconfig: "./tsconfig-lib.json"
  })
}
function createTerserPlugin() {
  return terser({
    compress: {
      keep_classnames: true,
      keep_fnames: true,
      keep_fargs: true
    },
    mangle: {
      keep_classnames: true,
      keep_fnames: true
    },
    format: {
      ascii_only: true
    }
  });
}
function createPrettierPlugin() {
  return prettier({
    parser: "typescript"
  });
}