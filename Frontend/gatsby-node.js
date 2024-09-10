const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html" || stage === "develop-html") {
        actions.setWebpackConfig({
            plugins: [
                // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
                new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                    resource.request = resource.request.replace(/^node:/, '');
                }),
            ],
            resolve: {
                // Handle Uncaught TypeError: util.inherits is not a function - https://github.com/webpack/webpack/issues/1019
                mainFields: ['browser', 'module', 'main'],
                // Handle unsupported node scheme - https://github.com/webpack/webpack/issues/13290#issuecomment-987880453
                fallback: {
                    util: require.resolve('util'),
                    stream: require.resolve('stream-browserify'),
                },
            },
            module: {
                rules: [
                    {
                        test: /@magenta/,
                        use: loaders.null(),
                    },
                    {
                        test: /canvas/,
                        use: loaders.null(),
                    },
                ],
            },
        });
    }
};
