/**
 * @author fbielejec
 */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {

  entry: "./src/main.js", // APP_PATH

  output: {
    filename: 'main.js',
    path: path.resolve('./dist') // BUILD_PATH
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10000'
      }

    ]
  },

  resolve: {
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "SpreaD3"
    }),
    //         new webpack.ProvidePlugin({
    //             'Promise': 'es6-promise'//, // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
    // //            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    //         }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })

  ]

};
