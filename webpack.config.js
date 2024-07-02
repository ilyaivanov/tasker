const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
  entry: "./src/index.ts",
  output: {
    filename: `app.js`,
    path: path.resolve(__dirname, "build"),
  },
  devtool: argv.mode === "development" ? "inline-source-map" : undefined,
  module: {
    rules: [
      {
        test: [/\.scss$/i],
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: `style.css` }),
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.svg",
    }),
  ],
  resolve: { extensions: [".ts", ".tsx", ".js", ".json", ".jpg"] },
});
