import webpack from 'webpack';
import htmlwebpackplugin from 'html-webpack-plugin';
import path from 'path';
const htmlWebPackRootPlugin = require('html-webpack-root-plugin');

const webpackConfigs: webpack.Configuration[] = [
  {
    name: 'development',
    mode: 'development',
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader'
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    plugins: [
      new htmlwebpackplugin({
        title: 'UI Web Components'
      }),
      new htmlWebPackRootPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      contentBase: path.join(__dirname, './dist'),
      hot: true,
      port: 9000
    }
  },
  {
    name: 'library',
    mode: 'production',
    entry: './src/index.tsx',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader'
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'webComponents.js',
      library: 'WebComponents',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: ['react'],
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: './react-dom',
        commonjs: ['./react-dom'],
        amd: 'react-dom'
      },
      'material-ui/core': {
        commonjs: 'material-ui',
        commonjs2: 'material-ui'
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
];

export default webpackConfigs;

/*

  Notes: 
  Tree shaking is a term commonly used within a 
  JavaScript context to describe the removal of dead code.

  It relies on the import and export statements in ES2015 to 
  detect if code modules are exported and imported for use between JavaScript files. 

  In modern JavaScript applications, we use module bundlers (e.g., webpack) to automatically remove dead code when bundling multiple JavaScript files into single files. This is important for preparing 
  code that is production ready, for example with clean structures and minimal file size. 

  Plugins:
  A webpack plugin is a JavaScript object that has an apply method.
  This apply method is called by the webpack compiler, giving access to the entire compilation lifecycle.

  Loaders:
  Out of the box, webpack only understands JavaScript and JSON files.
  Loaders allow webpack to process other types of files and
  convert them into valid modules that can be consumed by your application and added to the dependency graph.

  The test property identifies which file or files should be transformed.
  The use property indicates which loader should be used to do the transforming.

  Output:
  The output property tells webpack where to emit the bundles it creates and how to name these files.
  It defaults to ./dist/main.js for the main output file and to the ./dist folder for any other generated file.

*/
