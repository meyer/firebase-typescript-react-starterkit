// @ts-check

const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { StartServerPlugin } = require('@meyer/start-server-webpack-plugin');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

/** @type {(env: { dev?: boolean }, options: { hot?: boolean }) => Promise<webpack.Configuration>} */
module.exports = async (env = {}, options = {}) => {
  const DEV_MODE = true; //env.dev || process.env.npm_lifecycle_event === 'start';
  const NODE_ENV = DEV_MODE ? 'development' : 'production';

  return {
    mode: NODE_ENV,
    node: {
      __dirname: false,
      __filename: false,
    },
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
    },
    context: path.resolve(__dirname),
    devtool: 'source-map',
    entry: {
      index: require.resolve('./src/index.ts'),
      server: require.resolve('./src/server.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: '[name].js',
      pathinfo: true,
      libraryTarget: 'commonjs2',
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
    },
    target: 'node',
    externals: [
      nodeExternals({
        whitelist: [/^lodash/, /webpack\/hot\/poll/, /webpack\/hot\/signal/],
        modulesDir: path.resolve(__dirname, '..', 'node_modules'),
      }),
    ],
    plugins: [
      new StartServerPlugin({
        entryName: 'server',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV }),
      new webpack.DefinePlugin({
        BUILD_TIMESTAMP: JSON.stringify(new Date().toLocaleString()),
        SF_TIMEZONE: JSON.stringify('America/Los_Angeles'),
      }),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.g(?:raph)?ql$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.(?:txt|p8)$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(?:js|tsx?)/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            plugins: ['lodash', '@babel/plugin-proposal-class-properties'],
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { node: '8.0' },
                  modules: false,
                },
              ],
            ],
          },
        },
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            compilerOptions: {
              module: 'esnext',
              target: 'esnext',
              jsx: 'preserve',
            },
          },
        },
      ],
    },
  };
};
