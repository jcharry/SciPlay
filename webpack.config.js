var webpack = require('webpack');
var path = require('path');
var env = process.env.BUILD_ENV;

var config = {
    entry: env === 'production' ? [
        path.resolve('./src/extras/polyfills.js'),
        path.resolve('./src/sciplay.js')
    ] :
    [
        // 'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        path.resolve('./src/extras/polyfills.js'),
        path.resolve('./src/sciplay.js')
    ],

    devtool: env === 'production' ? null : 'source-map',
    externals: {
        polyfill: "./src/extras/polyfills.js"
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'sciplay.js',
        library: 'sciplay',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        root: __dirname,
        modulesDirectories: [
            'node_modules'
        ],
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
    }
    // plugins: env === 'production' ?
    //     [new webpack.optimize.UglifyJsPlugin({minimize: true})] :
    //     []
};

module.exports = config;
