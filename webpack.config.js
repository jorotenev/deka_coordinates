var path = require('path');

module.exports = {
    watch: true,
    mode: "development",
    devtool: 'cheap-module-eval-source-map',
    entry: './src/app.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname)
    }
};