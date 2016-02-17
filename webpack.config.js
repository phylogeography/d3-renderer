/**
 * @author fbielejec
 */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

//var ROOT_PATH = path.resolve(__dirname);
//var APP_PATH = path.resolve(ROOT_PATH, 'src');
//var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {

    entry: "./src/main.js", // APP_PATH

    output: {
        filename: 'main.js',
        path: path.resolve('./dist') // BUILD_PATH  
    },

//	devServer : {
//		historyApiFallback : true,
//		hot : true,
//		inline : true,
//		progress : true,
//		port : 8080
//	},
    
    module: {
        loaders: [
            
                  { test: /\.css$/, loader: 'style-loader!css-loader' }
            
//            {
//                test: /\.json/,
//                loader: 'json-loader'
//            }
            
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules']
    },

    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true }),
        new HtmlWebpackPlugin({title : "Influenza-Vis"})
    ]

};
