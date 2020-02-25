const path = require('path');
// var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const glob = require('glob');

module.exports = env => {
  // export default env => {
  const dotenvPath = env.dev ? './.env.dev' : './.env.prod';
  const plugins = [
    new Dotenv({
      path: dotenvPath,
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
    }),
  ];
  if (env.dev) {
    plugins.push(
      new WebpackShellPlugin({
        onBuildEnd: ['npm run node:watch'],
      })
    );
  }

  const outputPath = env.dev ? 'dist' : 'build';
  const mode = env.dev ? 'development' : 'production';
  const devtoolOptions = env.dev ? 'eval-source-map' : 'hidden-source-map';

  // const entry = env.dev
  //   ? glob.sync('./src/**/*.{ts,tsx}', { ignore: '.src/types.d.ts' }).reduce((acc, file) => {
  //       acc[file.replace(/^\.\/src\//, '')] = file;
  //       return acc;
  //     }, {})
  //   : './src/server.ts';

  // const output = env.dev
  //   ? {
  //       path: path.resolve(__dirname, 'dist'),
  //       filename: '[name].js',
  //     }
  //   : {
  //       path: path.resolve(__dirname, 'build'),
  //       filename: 'bundle.js',
  //     };

  return {
    mode,
    entry: './src/server.ts',
    target: 'node',
    externals: [nodeExternals()],
    devtool: devtoolOptions,
    watch: env.dev,
    output: {
      path: path.resolve(__dirname, outputPath),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
    },
    module: {
      rules: [
        {
          loader: 'ts-loader',
          test: /\.ts?$/,
          exclude: /node_modules/,
        },
      ],
    },
    plugins: plugins,
  };
};
