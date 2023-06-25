import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import fs from "node:fs/promises";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
const p = JSON.parse(await fs.readFile("package.json"));

const commonPlugins = [
  resolve(),
  babel({
    exclude: "node_modules/**",
    babelHelpers: "bundled"
  })
];

const commonConfig = {
  input: "index.js",
};

const commonOutput = {
  preserveModules: false,
  sourcemap: true,
  banner: `/* 这是一条 banner？没错，这是一条 banner。这是 ${p.version} 版本的 ${p.name}。 */`,
};

const demo = () => ({
  ...commonConfig,
  output: {
    name: "focusNoJutsu",
    file: "examples/run-start/demo.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    ...commonPlugins,
    serve({
      port: 6969,
      contentBase: "examples/run-start",
    }),
    livereload({
      port: 6969,
      watch: "examples/run-start",
    })
  ]
});

const cjs = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/focus-no-jutsu.cjs",
      format: "cjs",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-no-jutsu.min.cjs",
      format: "cjs",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const esm = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/focus-no-jutsu.esm.js",
      format: "esm",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-no-jutsu.esm.min.js",
      format: "esm",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const umd = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/focus-no-jutsu.umd.js",
      format: "umd",
      noConflict: true,
      name: "focusNoJutsu",
      ...commonOutput,
      globals: {},
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-no-jutsu.umd.min.js",
      format: "umd",
      noConflict: true,
      name: "focusNoJutsu",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const configMap = new Map([
  ["demo", demo],
  ["cjs", cjs],
  ["esm", esm],
  ["umd", umd],
]);

const chosenConfig = configMap.get(process.env.BUILD_ENV);
if (chosenConfig == null) 
  throw Error("You must define process.env.BUILD_ENV before building with rollup. Check rollup.config.js for valid options.");

export default chosenConfig;