// https://webpack.js.org/guides/migrating/
var path = require('path')
    , webpack = require('webpack')
    , util = require('util')

    // webpack plugins
    , autoprefixer = require('autoprefixer')
    , HtmlWebpackPlugin = require('html-webpack-plugin')
    , CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
    , InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
    , WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
    , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    , ExtractTextPlugin = require('extract-text-webpack-plugin');

// set environment variable or it wont work
process.env.NODE_ENV = 'production';

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

var config = {
    entry: {
        app: [
            // Include an alternative client for WebpackDevServer. A client's job is to
            // connect to WebpackDevServer by a socket and get notified about changes.
            // When you save a file, the client will either apply hot updates (in case
            // of CSS changes), or refresh the page (in case of JS changes). When you
            // make a syntax error, this client will display a syntax error overlay.
            // Note: instead of the default WebpackDevServer client, we use a custom one
            // to bring better experience for Create React App users. You can replace
            // the line below with these two lines if you prefer the stock client:
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            require.resolve('webpack-dev-server/client') + '?http://localhost:3100/',
            require.resolve('webpack/hot/dev-server'),
            // Finally, this is your app's code:
            path.resolve(__dirname, 'src/index.js'),
            // We include the app code last so that if there is a runtime error during
            // initialization, it doesn't blow up the WebpackDevServer client, and
            // changing JS code would still trigger a refresh.        
        ],
        vendor: path.resolve(__dirname, '3rdparty')

    },
    output: {
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: path.resolve(__dirname, 'build'),
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: 'assets/bundle.js',
        // This is the URL that app is served from. We use "/" in development.
        publicPath: publicPath
    },
    module: {
        rules: [
            {
                //Load .js and .jsx files with babel-loader.
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        babelrc: false,
                        presets: [require.resolve('babel-preset-react-app')],
                    }
                },
                exclude: [path.resolve(__dirname, 'node_modules')]
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader', options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader', options: {
                            sourceMap: true
                        }
                    }],
                    fallback: 'style-loader'
                })
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file',
                    query: {
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                },

            },
            // "url" loader works just like "file" loader but it also embeds
            // assets smaller than specified size as data URLs to avoid requests.
            {
                test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
                use: {
                    loader: 'url',
                    query: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            },
            {
                //Enable SVG includes.
                test: /\.svg$/i,
                use: 'babel-loader!react-svg-loader'
            }
        ]
    },
    resolve: {
        // what dirs should be searched when resolving modules
        modules: [ 'node_modules' ] // default
    },
    plugins: [
        // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
        // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
        // In development, this will be an empty string.
        new InterpolateHtmlPlugin({
            PUBLIC_URL: publicUrl
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
        }),
        new ExtractTextPlugin("assets/styles.css"),
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
        new webpack.DefinePlugin(env),
        // This is necessary to emit hot updates (currently CSS only):
        new webpack.HotModuleReplacementPlugin(),
        // Watcher doesn't work well if you mistype casing in a path so we use
        // a plugin that prints an error when you attempt to do this.
        // See https://github.com/facebookincubator/create-react-app/issues/240
        new CaseSensitivePathsPlugin(),
        // If you require a missing module and then `npm install` it, you still have
        // to restart the development server for Webpack to discover it. This plugin
        // makes the discovery automatic so you don't have to restart.
        // See https://github.com/facebookincubator/create-react-app/issues/186
        new WatchMissingNodeModulesPlugin('node_modules'),
        // browsersync
        new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                proxy: 'http://localhost:3100'
            }, {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false,
                open: false
            }
        ),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min-[hash:6].js'),
    ]
};

module.exports = config;



function getClientEnvironment(publicUrl) {
    var REACT_APP = /^REACT_APP_/i;

    var processEnv = Object
        .keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce((env, key) => {
            env[key] = JSON.stringify(process.env[key]);
            return env;
        }, {
            // Useful for determining whether we’re running in production mode.
            // Most importantly, it switches React into the correct mode.
            'NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development'
            ),
            // Useful for resolving the correct path to static assets in `public`.
            // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
            // This should only be used as an escape hatch. Normally you would put
            // images into the `src` and `import` them in code to get their paths.
            'PUBLIC_URL': JSON.stringify(publicUrl)
        });
    return {'process.env': processEnv};
}