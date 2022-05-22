const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        allowedHosts: 'all', // необходим app серверу для запроса манифеста
        proxy: {
            '/': {
                target: 'http://app:8081',
                pathRewrite: { '^(/.*)': '$1?dev=1' },
            },
        }
    },

    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ]
    },
});