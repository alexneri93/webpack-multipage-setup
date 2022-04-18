const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MediaQueryPlugin = require('media-query-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlValidatePlugin = require('html-validate-webpack-plugin');
const path = require('path');
//const production = process.env.NODE_ENV == "production";

const pages = ["index", "about"];

module.exports = {  
    output: {
        path: path.resolve(__dirname, "dist") // this is the default value
    }, 
    //need this to generate the CSS
    entry:
    pages.reduce((config, page) => {
        config[page] = `./src/${page}.js`;
        return config;
    }, {}),
    //mode: production ? 'production' : 'development',
    mode: "production",
    module: {
        rules: [
            {
                test: /\.scss$/,
                //inverse order of execution
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader",
                    MediaQueryPlugin.loader,
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),     
        new MediaQueryPlugin({
            include: true,
            queries: {
                //define the media queries
                'screen and (min-width: 756px)': 'desktop'
            }
        }),
        new HtmlValidatePlugin(),
    ].concat(
        pages.map(
            (page) =>
            new HtmlWebpackPlugin({
                title: `${page} page`,
                inject: false,  //CSS and JS injected manually in the template
                template: `./src/templates/${page}.html`,
                filename: `${page}.html`,
                chunks: [page],
            })
        )
    ),
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ]
    },
    //To see scss code on devtools
    //devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
};