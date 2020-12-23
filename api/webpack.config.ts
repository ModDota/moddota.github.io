import { TransformOptions } from '@babel/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// Required to augment `Configuration`
import type {} from 'webpack-dev-server';

const resolve = (name: string) => path.resolve(__dirname, name);
const tsconfigPath = resolve('src/tsconfig.json');

export default (env: Record<string, any> = {}, argv: Configuration): Configuration => {
  const isProduction = argv.mode === 'production';

  const babelConfig: TransformOptions = {
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['babel-plugin-styled-components', { ssr: false }],
      ...(isProduction ? [] : [require.resolve('react-refresh/babel')]),
    ],
    presets: [
      '@babel/preset-typescript',
      '@babel/preset-react',
      [
        '@babel/preset-env',
        {
          loose: true,
          targets: ['last 1 chrome version', 'last 1 firefox version'],
          include: ['proposal-nullish-coalescing-operator', 'proposal-optional-chaining'],
        },
      ],
    ],
  };

  return {
    output: {
      publicPath: '/api/',
      filename: isProduction ? '[name].[contenthash].js' : undefined,
      path: path.resolve(__dirname, '../build/api')
    },

    devtool: isProduction ? 'nosources-source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        '~utils': resolve('src/utils'),
        '~components': resolve('src/components'),
      },
    },
    optimization: {
      moduleIds: isProduction ? 'hashed' : undefined,
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: resolve('src'),
          use: [{ loader: 'babel-loader', options: babelConfig }],
        },
        {
          test: /\.svg$/,
          use: [
            { loader: 'babel-loader', options: babelConfig },
            { loader: '@svgr/webpack', options: { babel: false, dimensions: false } },
          ],
        },
      ],
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: { configFile: tsconfigPath },
        logger: { devServer: false },
      }),

      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({ patterns: [resolve('public')] }),
      new HtmlWebpackPlugin({
        template: resolve('src/index.html'),
        minify: { minifyCSS: true, minifyJS: true, removeComments: true, collapseWhitespace: true },
      }),

      ...(isProduction ? [] : [new ReactRefreshWebpackPlugin()]),

      ...(env.analyze ? [new BundleAnalyzerPlugin()] : []),
    ],

    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
  };
};
