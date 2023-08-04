import path from "node:path";
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProdMode = process.env.NODE_ENV === "production";

export default {
  mode: isProdMode ? "production" : "development",
  entry: "./src/index.js",
  target: "web",
  output: {
    filename: "js/[name].[fullhash:8].js",
    path: path.resolve(__dirname, "output"),
    clean: true,
    publicPath: '',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[fullhash:8].css",
    }),
    new HtmlWebpackPlugin(getHtmlWebpackPluginOpts())
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "output"),
    },
    port: 3000,
    liveReload: true,
    watchFiles: `${path.resolve(__dirname, "src")}/**/*`,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpe?g|svg|png|gif|ico)$/,
        type: "asset",
        generator: {
          filename: "img/[name]-[hash:8][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
    alias: {
      '@': path.resolve(__dirname, "src"),
      "@img": path.resolve(__dirname, "src", "assets", "img"),
    },
  },
  optimization: {
    minimizer: [
      "...",
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
    },
  },
};

function getHtmlWebpackPluginOpts() {
  return isProdMode ? {
    template: path.join(__dirname, `src/index.html`),
    // favicon: path.resolve(__dirname, "src/assets/focus-fly.ico"),
    inject: true,
    minify: {
      html5: true,
      collapseWhitespace: true,
      preserveLineBreaks: false,
      minifyCSS: true,
      minifyJS: true,
      removeComments: false
    },
  } : {
    template: path.join(__dirname, `src/index.html`),
  };
}