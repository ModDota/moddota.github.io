---
title: Bundling scripts with webpack
author: ark120202
---

## What is webpack and why should I use it?

Working on a large codebase there are two ways to organize your code. The first is just keeping all logic in a single `.js` file, which quickly becomes hard to change and comprehend. The second approach is splitting code by functionality, creating multiple `.js` files and including all of them in the layout file.

While the second approach is preferred it also has some problems. Lack of explicit references to value definitions makes it hard to track where a certain values comes from, and, since all files use a single shared scope, naming conflicts can arise.

In Lua these problems are solved with `require` function, which allows one script to include another. JavaScript also got an official solution to this problem in EcmaScript 2015 - modules.

The concept of modules is pretty simple. First you need to mark things that you want to expose from a file with `export` keyword:

```ts title="utils.js"
export function sayHello() {
  $.Msg('Hello, world!');
}
```

And then you can `import` it in other file:

```ts title="script.js"
import { sayHello } from './utils';

sayHello();
```

However there's a catch: even though modules have been a part of JavaScript for a while, a lot of integrations (including Panorama) don't support it yet.

That's where webpack is useful. webpack takes your modules, resolves dependencies and merges them into a single plain `.js` file, that can be used in Panorama.

In addition, webpack:

- Gives you an access to [a large ecosystem](https://www.npmjs.com/) of JavaScript packages
- Makes it easier to share code with other custom games, using custom packages and [npm](https://www.npmjs.com/)
- Makes it possible to share code with other environments, such as Node.js-based web servers, or Lua side of your custom game built with [TypeScriptToLua](https://typescripttolua.github.io/)
- Consolidates all your Panorama code transformation tools, such as TypeScript, Sass, and code generators

## Getting Started

:::note
You can skip most of the manual configuration in this guide by using a [JavaScript](https://github.com/ark120202/dota-templates/tree/webpack) or [TypeScript](https://github.com/ark120202/dota-templates/tree/webpack-typescript) templates.
:::

### Installation

1. Install [Node.js](https://nodejs.org/).
2. Create a `package.json` file in the root directory of your project with this content:

```json
{
  "scripts": {
    "build": "node --preserve-symlinks node_modules/webpack/bin/webpack.js --config content/panorama/webpack.config.js",
    "dev": "node --preserve-symlinks node_modules/webpack/bin/webpack.js --config content/panorama/webpack.config.js --watch"
  }
}
```

:::note
We have to use `node --preserve-symlinks node_modules/webpack/bin/webpack.js` instead of just `webpack` because of reverse symlinking.
:::

3. Install dependencies by opening a command prompt and executing `npm install -D webpack@next webpack-cli webpack-panorama`.

### Basic Configuration

webpack requires you to pass a configuration file, telling it how to transform your files. As you might have noticed in the previous step, in this tutorial we'll store it in `content/panorama/webpack.config.js`.

Here's a basic configuration:

```js title="content/panorama/webpack.config.js"
const path = require('path');
const { PanoramaTargetPlugin } = require('webpack-panorama');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    hud: './hud/script.js',
  },

  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'scripts/custom_game'),
  },

  resolve: {
    // Required because of reverse symlinking
    symlinks: false,
  },

  plugins: [new PanoramaTargetPlugin()],
};
```

Now let's create a few files for webpack to work on:

```js title="content/panorama/src/hud/script.js"
import { sayHello } from '../utils';

sayHello();
```

```js title="content/panorama/src/utils.js"
export function sayHello() {
  $.Msg('Hello, world!');
}
```

And layout files to make Panorama run our script:

```xml title="content/panorama/layout/custom_game/hud.xml"
<root>
  <scripts>
    <!-- highlight-next-line -->
    <include src="file://{resources}/scripts/custom_game/hud.js" />
  </scripts>
  <Panel />
</root>
```

```xml title="content/panorama/layout/custom_game/custom_ui_manifest.xml"
<root>
  <Panel>
    <!-- highlight-next-line -->
    <CustomUIElement type="Hud" layoutfile="file://{resources}/layout/custom_game/hud.xml" />
  </Panel>
</root>
```

Now you can run `npm run build` in your terminal to build the project once, or `npm run dev` to make it rebuild the project every time you change your scripts.

After building the project, webpack would output a `content/panorama/scripts/custom_game/hud.js` bundle.

### Using external packages

Besides local script files, modules allow you to use code written by other developers.

For example, let's add a popular utility library [`lodash`](https://lodash.com/).

First, you need to add it to your project using npm:

```shell
npm install lodash
```

And then you can import it like any other module:

```js
import * as _ from 'lodash';

$.Msg(_.uniq([1, 2, 1, 3, 1, 2])); // => [1,2,3]
```

Similarly you can use packages created specifically for Panorama, for example [react-panorama](./react.md) or [`panorama-polyfill`](https://www.npmjs.com/package/panorama-polyfill).

You can find more packages built for Panorama using this search query: [keywords:dota, panorama](https://www.npmjs.com/search?q=keywords%3Adota%2C%20panorama).

## Loaders and TypeScript

webpack loaders are packages that process your files before webpack puts them into a bundle.

One good example of a loader is [`babel-loader`](https://www.npmjs.com/package/babel-loader), which processes your code with Babel, allowing you to use newer JavaScript features, and non-standard syntax extensions, such as [JSX](./react.md#JSX).

First you need to install a few dependencies:

```shell
npm install -D babel-loader @babel/core @babel/preset-react
```

Now you need to tell webpack when and how to use this loader, using `module.rules` configuration section:

```diff title="content/panorama/webpack.config.js"
  resolve: {
    symlinks: false,
  },

+ module: {
+   rules: [
+     { test: /\.js$/, loader: 'babel-loader', options: { presets: ['@babel/preset-react'] } },
+   ],
+ },

  plugins: [new PanoramaTargetPlugin()],
```

### TypeScript

Currently support for [TypeScript](introduction-to-panorama-ui-with-typescript.md) for Panorama cannot be provided just with a loader, because of a way referenced script files are processed. To resolve this you also need to use [`fork-ts-checker-webpack-plugin`](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin).

```shell
npm install -D typescript ts-loader fork-ts-checker-webpack-plugin
npm install panorama-types
```

```diff title="content/panorama/webpack.config.js"
+const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: {
-   hud: './hud/script.js',
+   hud: './hud/script.ts',
  },

  resolve: {
+   extensions: ['.ts', '.tsx', '...'],
    symlinks: false,
  },

+ module: {
+   rules: [
+     { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } },
+   ],
+ },

  plugins: [
    new PanoramaTargetPlugin(),
+   new ForkTsCheckerWebpackPlugin({
+     typescript: {
+       configFile: path.resolve(__dirname, "tsconfig.json"),
+     },
+   }),
  ],
};
```

```json title="content/panorama/tsconfig.json"
{
  "include": ["src"],
  "compilerOptions": {
    "target": "es2017",
    "lib": ["es2017"],
    "types": ["panorama-types"],
    "moduleResolution": "node",
    "strict": true
  }
}
```

## XML layout files

In the previous steps webpack have been used only for script assets. This isn't perfect, because you have to manually keep entry points in sync, directory structure isn't centralized, and you can't use webpack for .css asset processing.

The solution is to let webpack take care of all your Panorama files.

And modify `webpack.config.js` like that:

```diff title="content/panorama/webpack.config.js"
const path = require('path');
const { PanoramaTargetPlugin } = require('webpack-panorama');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
-   hud: './hud/script.js',
+   hud: { filename: 'hud/layout.xml', import: './hud/layout.xml' },
  },

  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'layout/custom_game'),
+   publicPath: 'file://{resources}/layout/custom_game/',
  },

  resolve: {
    symlinks: false,
  },

+ module: {
+   rules: [
+     { test: /\.xml$/, loader: 'webpack-panorama/lib/layout-loader' },
+     { test: /\.js$/, issuer: /\.xml$/, loader: 'webpack-panorama/lib/entry-loader' },
+   ],
+ },

  plugins: [new PanoramaTargetPlugin()],
};
```

Now you need to move layout file to the source directory, and use relative script path:

```xml title="content/panorama/src/hud/layout.xml"
<root>
  <scripts>
    <!-- highlight-next-line -->
    <include src="./script.js" />
  </scripts>
  <Panel />
</root>
```

## Custom UI Manifest

Now you don't need to synchronize your script entrypoints and layout script references, however you still have to do this for `custom_ui_manifest.xml`. `PanoramaManifestPlugin` allows you to define your entrypoints in a simple format, and generates `custom_ui_manifest.xml` including them.

```diff title="content/panorama/webpack.config.js"
const path = require('path');
-const { PanoramaTargetPlugin } = require('webpack-panorama');
+const { PanoramaManifestPlugin, PanoramaTargetPlugin } = require('webpack-panorama');

/** @type {import('webpack').Configuration} */
module.exports = {
- entry: {
-   hud: { filename: 'hud/layout.xml', import: './hud/layout.xml' },
- },

  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'layout/custom_game'),
    publicPath: 'file://{resources}/layout/custom_game/',
  },

  module: ...,

  plugins: [
    new PanoramaTargetPlugin(),
+   new PanoramaManifestPlugin({
+     entries: [{ import: './hud/layout.xml', type: 'Hud' }]
+   }),
  ],
};
```

:::note
Since webpack 5 is currently in beta, some transitive dependencies might yield deprecation warnings. They can be safely ignored.
:::

`entries` option of `PanoramaManifestPlugin` accepts a list of entrypoints following this schema:

```ts
interface ManifestEntry {
  /**
   * Module(s) that are loaded upon startup.
   */
  import: string;

  /**
   * Specifies the name of the output file on disk.
   *
   * @example
   * { import: './loading-screen/layout.xml', filename: 'custom_loading_screen.xml' }
   */
  filename?: string | null;

  /**
   * Type of a Custom UI.
   *
   * When not provided, this entry would be omitted from `custom_ui_manifest.xml` file.
   *
   * Can be defined only for XML entrypoints.
   */
  type?: ManifestEntryType | null;
}

type ManifestEntryType =
  | 'GameSetup'
  | 'HeroSelection'
  | 'Hud'
  | 'HudTopBar'
  | 'FlyoutScoreboard'
  | 'GameInfo'
  | 'EndScreen';
```

## CSS

Since now all layout files are processed with webpack, adding a new resource type isn't any different from adding a new resource type for JavaScript.

```shell
npm install -D file-loader
```

```diff title="content/panorama/webpack.config.js"
  module: {
    rules: [
      { test: /\.xml$/, loader: 'webpack-panorama/lib/layout-loader' },
      { test: /\.js$/, issuer: /\.xml$/, loader: 'webpack-panorama/lib/entry-loader' },
+     {
+       test: /\.css$/,
+       issuer: /\.xml$/,
+       loader: 'file-loader',
+       options: { name: '[path][name].css', esModule: false },
+     },
    ],
  },
```

### SASS

```shell
npm install -D sass-loader sass
```

```diff title="content/panorama/webpack.config.js"
  module: {
    rules: [
      { test: /\.xml$/, loader: 'webpack-panorama/lib/layout-loader' },
      { test: /\.js$/, issuer: /\.xml$/, loader: 'webpack-panorama/lib/entry-loader' },
      {
-       test: /\.css$/,
+       test: /\.(css|s[ac]ss)$/,
        issuer: /\.xml$/,
        loader: 'file-loader',
        options: { name: '[path][name].css', esModule: false },
      },
+     { test: /\.s[ac]ss$/, loader: 'sass-loader' }
    ],
  },
```
