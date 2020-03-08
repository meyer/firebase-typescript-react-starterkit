// @ts-check

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const JsxstylePlugin = require('jsxstyle-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const DEV_MODE = process.env.npm_lifecycle_event === 'start';
const NODE_ENV = DEV_MODE ? 'development' : 'production';

/** @type {(env: {}, options: { port?: number; hot?: boolean; https?: boolean }) => Promise<webpack.Configuration>} */
module.exports = async (env = {}, options = {}) => {
  const wdsPort = options.port;
  const isWDS = process.env.WEBPACK_DEV_SERVER === 'true';

  if (isWDS && wdsPort == null) {
    throw new Error('The `--port` flag is required when running `webpack-dev-server`');
  }

  /** @type {webpack.Configuration} */
  const reactAppConfig = {
    mode: NODE_ENV,
    resolve: {
      mainFields: ['browser', 'main', 'module'],
      extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
    },
    context: path.resolve(__dirname),
    devtool: 'source-map',
    entry: {
      main: require.resolve('./src/entrypoint.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: '[name].js',
    },
    target: 'web',
    optimization: {
      noEmitOnErrors: true,
    },
    plugins: [
      new JsxstylePlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new webpack.EnvironmentPlugin({ NODE_ENV }),
      new HtmlWebpackPlugin({
        title: 'firebase-typescript-react-starterkit',
        inject: false,
        filename: 'index.html',
        chunks: ['main'],
        template: path.resolve(__dirname, 'src', 'template.ejs'),
      }),
      new CopyPlugin(['static'], { ignore: ['**/*.sketch'] }),
    ],
    module: {
      rules: [
        {
          test: /\.flow$/,
          loader: 'null-loader',
        },
        {
          test: /\.g(?:raph)?ql$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        {
          test: /\.(?:js|tsx?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: ['lodash', ['@babel/plugin-transform-runtime', { corejs: 3 }]],
                presets: ['@babel/preset-react', ['@babel/preset-env', { modules: false }]],
              },
            },
            !DEV_MODE && JsxstylePlugin.loader,
          ].filter(Boolean),
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
            compilerOptions: {
              jsx: 'preserve',
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('postcss-preset-env')()],
              },
            },
          ],
        },
      ],
    },
  };

  if (isWDS) {
    const protocol = 'http' + (options.https ? 's' : '');
    const publicPath = `${protocol}://localhost:${wdsPort}/`;
    reactAppConfig.output.publicPath = publicPath;

    reactAppConfig.devServer = {
      hot: false,
      inline: true,
      open: false,
      overlay: true,
      publicPath,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Strict-Transport-Security': 'max-age=0',
      },
      proxy: {
        '/api': 'http://localhost:3000',
        '/graphql': 'http://localhost:3000',
      },
      // catch a few common 404s
      before(app, server) {
        // app.route("/css/main.css").get((req, res) => {
        //   res.type("css").send("/* Not served in development */");
        // });
        // app.route("/favicon.ico").get((req, res) => {
        //   res.sendFile(path.join(__dirname, "..", "assets", "favicon.ico"));
        // });
      },
      stats: {
        children: false,
        modules: false,
        exclude: undefined,
        warnings: false,
        // see: https://github.com/TypeStrong/ts-loader/blob/fb7eb9d/README.md#transpileonly-boolean-defaultfalse
        warningsFilter: /export .* was not found in/,
        colors: true,
      },
      historyApiFallback: true,
      port: wdsPort,
      allowedHosts: ['localhost'],
    };
  }

  return reactAppConfig;
};
