var webpack = require('webpack');
var path = require('path');
var env = process.env.BUILD_ENV;

var config = {
    entry: [
        path.resolve('./src/extras/polyfills.js'),
        path.resolve('./src/sciplay.js')
    ],
    devtool: 'source-map',
    externals: {
        polyfill: "./src/extras/polyfills.js"
    },
    output: {
        path: path.resolve('./dist'),
        filename: env === 'build' ? 'sciplay.min.js' : 'sciplay.js',
        library: 'sciplay',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        root: __dirname,
        modulesDirectories: [
            'node_modules'
        ],
        alias: {
            src: 'src'
        },
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: env === 'build' ?
        [new webpack.optimize.UglifyJsPlugin({minimize: true})] :
        []
};

module.exports = config;
