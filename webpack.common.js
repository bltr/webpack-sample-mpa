const path = require('path')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        app: './src/app.js',
        admin: './src/admin.js',
    },

    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './public'),
        publicPath: '/', // если не указать - неверно генерируется манифест
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[contenthash][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator:  {
                    filename: 'fonts/[name].[contenthash][ext]',
                }
            },
        ]
    },

    resolve: {
        extensions: ['.js', '.json', '.scss', '.css'],
        alias: {
            "@": path.resolve(__dirname, "../src/"),
        }
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {from: './src/assets/favicon.ico'},
                {from: './src/assets/robots.txt'},
            ]
        }),
        new WebpackManifestPlugin({
            generate: (seed, files) => {
                return Object.fromEntries(files
                    .filter(({name}) => {
                        return name.endsWith('.css') || name.endsWith('.js')
                    })
                    .map(({name, path}) => {
                        return [path.replace(/([a-f0-9]{20}\.?)/gi, ''), path]
                    })
                )
            }
        }),
    ],
};