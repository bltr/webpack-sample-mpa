const { merge } = require('webpack-merge')
const path = require('path');
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCss = require('purgecss-webpack-plugin')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'production',
    // devtool: 'source-map',

    optimization: {
        splitChunks: {
            chunks: 'all',
            name: 'common',
            minSize: 10000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },

    output: {
        filename: 'js/[name].[contenthash].js', // необходим ли хеш для dev mode? возможно будет мешать при обработке hmr js модулей
        publicPath: '/', // если не указать - неверно генерируется манифест
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        // плохо работает с bootstrap - см ./src/view/__purgecss.html
        new PurgeCss({
            // необходимо указывать директорию с шаблонами
            paths: glob.sync(path.resolve(__dirname, './src/views/**/*'), {nodir: true})
        }),
    ],
});