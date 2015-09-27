var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    PathRewriter = require('webpack-path-rewriter')

var env = process.env, opts = {
  dstDir: env.DST_DIR || path.join(__dirname, '_dist'),
  dev: strToBool(env.DEV, true),
  livereload: strToBool(env.LIVERELOAD, false),
  hot: process.argv.indexOf('--hot') !== -1,
  hash: strToBool(env.HASH, false),
  uglify: strToBool(env.UGLIFY, false)
}

babelExcludeRE = new RegExp(
  'node_modules'
)

var commonExtractTextPlugin = new ExtractTextPlugin('styles/common.css'),
    appExtractTextPlugin = new ExtractTextPlugin('styles/app.css')

module.exports = {
  entry: {
    app: [
      opts.hot && 'webpack-dev-server/client?http://localhost:5783', // WebpackDevServer host and port
      opts.hot && 'webpack/hot/only-dev-server',
      './src'
    ]
    .filter(skipFalsy)
  },
  output: {
    path: opts.dstDir,
    filename: 'bundle.js',
    // filename: opts.hash ? '[name]-[chunkhash].js' : '[name]-dev.js',
    pathinfo: opts.dev
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    root: path.resolve(__dirname, 'src'),
    fallback: [ __dirname ]
  },
  devtool: 'source-map',
  debug: opts.dev,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: babelExcludeRE,
        loaders: ['babel?optional[]=runtime,optional[]=es7.asyncFunctions,optional[]=es7.decorators,optional[]=es7.classProperties,optional[]=es7.objectRestSpread']
      },
      {
        test: /[/]styles[/]common[/].*[.]scss$/,
        loader: styleLoader('css!sass', commonExtractTextPlugin)
      },
      {
        test: /[/]styles[/]helvetica[/].*[.]scss$/,
        loader: styleLoader('css!sass', appExtractTextPlugin)
      },
      {
        test: /[.]html$/,
        loader: PathRewriter.rewriteAndEmit({
          name: opts.hash ? '[path][name]-[hash].[ext]' : '[path][name].[ext]'
        })
      },
      {
        test: /[/]assets[/]/,
        exclude: /[.](jade|html)$/,
        loader: 'file?name=' + (opts.hash ? '[path][name]-[hash].[ext]' : '[path][name]-dev.[ext]')
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/]locale$/, /(?:en|ru)[.]js/),
    !opts.dev && new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': '"production"'
      }
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    commonExtractTextPlugin,
    appExtractTextPlugin,

    new PathRewriter({
      includeHash: opts.livereload,
      emitStats: false,
      silent: false
    }),

    opts.uglify && new webpack.optimize.UglifyJsPlugin(),
  ]
  .filter(skipFalsy),
  postcss: {
    defaults: [require('postcss-import')({glob:true}), require('postcss-mixins'), require('postcss-simple-vars'), require('postcss-calc')(), require('postcss-color-function')(), require('postcss-nested'), require('autoprefixer-core'), require('csswring')]
  },
}

/*
 * TODO: enable CSS source maps in hot mode when
 * https://github.com/webpack/css-loader/issues/29
 * get fixed
 */
function styleLoader(loader, instance) {
  return opts.hot
    ? 'style!' + loader
    : instance.extract(loader.replace(/(?:^|!)[^!]*/g, '$&?sourceMap'))
}


function strToBool(val, def) {
  if (val === undefined)
    return def
  val = val.toLowerCase()
  return val === '1' || val === 'true' || val === 'yes' || val === 'y'
}


function skipFalsy(item){
  return !!item
}
