const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeSass = require('node-sass');
const FontPreloadPlugin = require('webpack-font-preload-plugin');

module.exports = env => {
  let mode = env.NODE_ENV;

  if (env !== undefined && env.WEBPACK_SERVE === true) {
    mode = 'development';
  } else if (env.NODE_ENV === 'development') {
    mode = 'development';
  } else {
    mode = 'production';
  }

  return {
    mode,

    entry: './src/Client.tsx',

    output: {
      filename: mode === 'production' ? 'js/[name].[contenthash].js' : '[name].[contenthash].js',
      chunkFilename: mode === 'production' ? 'js/[id].[chunkhash].js' : '[id].[contenthash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
    },

    module: {
      rules: [
        {
          test: /\.ext$/,
          use: ['cache-loader', 'babel-loader', 'resolve-url-loader', 'style-loader', 'css-loader', 'sass-loader'],
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: /\.ts(x?)$/,
          include: path.resolve(__dirname, 'src'),
          exclude: [
            /(node_modules)/,
          ],
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[contenthash][ext][query]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          },
        },
        {
          test: /\.(scss|css)$/i,
          use: mode === 'development' ? [
            {
              loader: 'style-loader',
              options: {
                esModule: true,
              },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                webpackImporter: false,
                implementation: nodeSass,
                sourceMap: true,
                sassOptions: {
                  outputStyle: 'compressed',
                },
              },
            },
          ] : [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '/',
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'resolve-url-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },

    resolve: {
      descriptionFiles: ['package.json'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        App: path.resolve(__dirname, 'src/app/'),
        Pages: path.resolve(__dirname, 'src/pages/'),
      },
      symlinks: false,
    },

    optimization: {
      minimize: mode === 'production',
      minimizer: mode === 'production' ? [
        new TerserPlugin({
          exclude: /(node_modules)/,
          parallel: true,
        }),
        new CssMinimizerPlugin(),
      ] : [],
      splitChunks: {
        chunks: 'all',

        cacheGroups: {
          vendor: {
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
            chunks: 'all',
            name: 'vendor',
          },
          components: {
            reuseExistingChunk: true,
            test: /[\\/]src[\\/]app[\\/]components[\\/]/,
            enforce: true,
            chunks: 'all',
            name: 'components',
          },
        },
      },
      runtimeChunk: 'single',
      moduleIds: mode === 'development' ? 'named' : 'deterministic',
      chunkIds: mode === 'development' ? 'named' : 'deterministic',
      nodeEnv: mode === 'development' ? 'development' : 'production',
      mangleExports: mode === 'development' ? false : 'deterministic',
      mangleWasmImports: true,
      removeAvailableModules: true,
      usedExports: true,
    },

    plugins: [
      new CleanWebpackPlugin(),
      new LoadablePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: mode === 'development' ? JSON.stringify('development') : JSON.stringify('production'),
        },
      }),

      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, './public/index.html'),
      }),

      new FontPreloadPlugin(),

      new webpack.NoEmitOnErrorsPlugin(),

      mode === 'development'
        ? new ESLintPlugin({
          context: path.resolve(__dirname, 'src/'),
          emitWarning: true,
        }) : () => {},

      mode === 'production'
        ? new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
          chunkFilename: 'css/[id].[chunkhash].css',
        }) : () => {},

      mode === 'production'
        ? new webpack.AutomaticPrefetchPlugin() : () => {},

      mode === 'production'
        ? new webpack.ids.HashedModuleIdsPlugin({
          context: __dirname,
          hashFunction: 'sha256',
          hashDigest: 'hex',
          hashDigestLength: 20,
        }) : () => {},

      new CopyPlugin({
        patterns: [
          { from: path.resolve(__dirname, './public/favicon.ico'), to: path.resolve(__dirname, 'build') },
          { from: path.resolve(__dirname, './public/manifest.json'), to: path.resolve(__dirname, 'build') },
        ],
      }),
    ],

    devServer: mode === 'development' ? {
      contentBase: path.join(__dirname, './public'),
      publicPath: '/',
      compress: true,
      port: 3000,
      watchContentBase: true,
      https: true,
      progress: true,
      hot: true,
      open: true,
      historyApiFallback: true,
      stats: 'errors-warnings',
      headers: {
        'Cache-Control': 'public, max-age=6048000, immutable',
      },
    } : {},

    target: 'web',

    devtool: mode === 'development' ? 'eval-cheap-module-source-map' : 'cheap-source-map',

    performance: {
      hints: 'error',
      maxEntrypointSize: 10000000,
      maxAssetSize: 10000000,
    },
  };
};
