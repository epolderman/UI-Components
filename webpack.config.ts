import webpack from 'webpack';

const pluginReporter = (
  percentage: number,
  message: string,
  moduleProgress?: string | undefined
) => console.info(percentage, ' Message:', message, ' Module Progress:', moduleProgress);

const config: webpack.Configuration = {
  entry: './src/index.tsx',
  /* 
    Loaders:
    Out of the box, webpack only understands JavaScript and JSON files. 
    Loaders allow webpack to process other types of files and 
    convert them into valid modules that can be consumed by your application and added to the dependency graph.

    The test property identifies which file or files should be transformed.
    The use property indicates which loader should be used to do the transforming.
  */
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
  /* 
    Output: 
    The output property tells webpack where to emit the bundles it creates and how to name these files. 
    It defaults to ./dist/main.js for the main output file and to the ./dist folder for any other generated file. 
  */
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  /*
  
  */
  plugins: [
    new webpack.ProgressPlugin(pluginReporter),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};

export default config;

/*

  Notes: 

  Tree shaking is a term commonly used within a 
  JavaScript context to describe the removal of dead code.

  It relies on the import and export statements in ES2015 to 
  detect if code modules are exported and imported for use between JavaScript files. 

  In modern JavaScript applications, we use module bundlers (e.g., webpack) to automatically remove dead code when bundling multiple JavaScript files into single files. This is important for preparing 
  code that is production ready, for example with clean structures and minimal file size. 


*/
