const path = require('path');
// var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
// export default env => {
  const dotenvPath = env.dev ? './.env.dev' : './.env.prod'; 
  return {
    mode: env.dev ? 'development' : 'production',
    entry: './src/server.ts',
    target: "node",
    externals: [nodeExternals()],
    devtool: 'inline-source-map',
    watch: env.dev,
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.ts', '.js'] //resolve all the modules other than index.ts
    },
    module: {
      rules: [
        {
          loader: 'ts-loader',
          test: /\.ts?$/,
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new Dotenv({
        path: dotenvPath,
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      })
    ]
  }
}
