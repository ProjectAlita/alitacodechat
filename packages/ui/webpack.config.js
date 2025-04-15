// Extra dependencies to get this config executable:
// npm i -D @babel/preset-react style-loader css-loader

import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack"

const contentPath = path.resolve("dist-webpack")

export default (env, argv) => {
  const config = {
    entry: path.resolve(path.join("src", "main.jsx")),
    output: {
      path: contentPath
    },
    mode: "production",
    resolve: {
      extensions: [".js", ".jsx"], // This allows webpack to resolve both .js and .jsx modules for import statements
      alias: {
        '@': path.resolve("src") // This maps @ to src in import statements
      }
    },
    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.(js|jsx)$/i,
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-react", {"runtime": "automatic"}]]
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.svg$/,
          oneOf: [
            {
              resourceQuery: /react/, // *.svg?react
              use: ['@svgr/webpack'],
            },
            {
              use: ['file-loader'],
            },
          ],
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false, // This will remove comments from the minified output
            },
          },
          extractComments: false, // This will disable the generation of license files
        }),
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // import.meta.env is required to support built-in Vite configurations
        "import.meta.env": {},
        "import.meta.env.ALTERNATIVE_HOST": JSON.stringify(env.plugin || "http://calltoide.com"),
      }),
      new webpack.ProvidePlugin({
        "styled": ['@mui/material/styles', 'styled'],
      }),
    ],
    devServer: {
      static: {
        directory: contentPath,
      },
    },
  };
  
  if (argv.mode === 'development') {
    config.devtool = "inline-source-map";
  }
  
  return config;
};