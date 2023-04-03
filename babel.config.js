const plugins = [
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
];

const config = {
  env: {
    es5: {
      presets: [
        [
          "@babel/preset-env",
          {
            loose: true,
          },
        ]
      ],
      plugins
    },
    esm: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            loose: true,
          },
        ]
      ],
      plugins,
    },
  },

}

export default config;