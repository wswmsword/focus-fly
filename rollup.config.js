import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import fs from "node:fs/promises";
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

const cjs = [
  {
    ...commonConfig,
    external: [],
    output: {
      file: "output/focus-loop.js",
      format: "cjs",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-loop.min.js",
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
      file: "output/focus-loop.esm.js",
      format: "esm",
      ...commonOutput,
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-loop.esm.min.js",
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
      file: "output/focus-loop.umd.js",
      format: "umd",
      noConflict: true,
      name: "focus-loop",
      ...commonOutput,
      globals: {},
    },
    plugins: commonPlugins,
  },
  {
    ...commonConfig,
    output: {
      file: "output/focus-loop.umd.min.js",
      format: "umd",
      noConflict: true,
      name: "focus-loop",
      ...commonOutput,
    },
    plugins: [...commonPlugins, terser()],
  }
];

const configMap = new Map([
  ["cjs", cjs],
  ["esm", esm],
  ["umd", umd],
]);

const chosenConfig = configMap.get(process.env.BUILD_ENV);
if (chosenConfig == null) 
  throw Error("You must define process.env.BUILD_ENV before building with rollup. Check rollup.config.js for valid options.");

export default chosenConfig;