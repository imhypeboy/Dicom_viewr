const path = require('path');

module.exports = {
    mode: 'development' ,
    entry: './src/index.js',
    output: {
        filename: 'cornerstone.js',
        path: path.resolve(__dirname, '..', 'src','main', 'webapp', 'static'),
    },

    resolve: {
        fallback: {
            'fs': false,
            'path': require.resolve("path-browserify")
        }
    }
};