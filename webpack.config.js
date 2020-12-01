const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const config = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve("../src"),
      "@img": path.resolve("../src/assets/img"),
      "@components": path.resolve("../src/components"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src"), // 只让loader解析我们src底下自己写的文件
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              //1024 == 1kb
              //小于10kb时打包成base64编码的图片否则单独打包成图片
              limit: 10240,
              name: path.resolve(__dirname, "/dist/img/[name].[hash:7].[ext]"),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: path.resolve(__dirname, "/dist/font/[name].[hash:7].[ext]"),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./public/index.html",
      inject: true,
    }),
  ],
  optimization:{
    minimizer: [new UglifyJsPlugin()],
  }
}

module.exports = function (env, argv) {
  if (argv.mode === "development") {
    config.devtool = "source-map"
    config.devServer = {
      port: 3000,
      historyApiFallback: true,
      overlay: {
        //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
        errors: true,
      },
      inline: true,
      hot: true,
    }
  }
  return config
}
