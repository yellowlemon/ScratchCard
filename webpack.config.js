const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        scratch: './src/scratch.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './dist/',
        filename: '[name].min.js',
        library: 'ScratchCard',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '~': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins:[
        // new webpack.optimize.UglifyJsPlugin({})
    ]
}
